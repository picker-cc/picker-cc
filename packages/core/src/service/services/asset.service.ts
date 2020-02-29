import {Injectable} from '@nestjs/common';
import {AssetType, CreateAssetInput} from '@picker-cc/common/lib/generated-types';
import path from 'path';
import {Stream} from 'stream';

import {RequestContext} from '../../api';
import {getAssetType} from '../../common/utils';
import {ConfigService, Logger} from '../../config';
import {Asset} from '../../entity';
import {EventBus} from '../../event-bus';
import {AssetEvent} from '../../event-bus/events/asset-event';
// tslint:disable-next-line:no-var-requires
const sizeOf = require('image-size');

@Injectable()
export class AssetService {
  constructor(
    private configService: ConfigService,
    private eventBus: EventBus
  ) {
  }

  async create(ctx: RequestContext, input: CreateAssetInput): Promise<Asset> {
    const {createReadStream, filename, mimetype} = await input.file;
    const stream = createReadStream();
    const asset = await this.createAssetInternal(stream, filename, mimetype);
    this.eventBus.publish(new AssetEvent(ctx, asset, 'created'));
    return asset;
  }

  private async createAssetInternal(stream: Stream, filename: string, mimetype: string): Promise<Asset> {
    const {assetOptions} = this.configService;
    const {assetPreviewStrategy, assetStorageStrategy} = assetOptions;
    const sourceFileName = await this.getSourceFileName(filename);
    const previewFileName = await this.getPreviewFileName(sourceFileName);
    const sourceFileIdentifier = await assetStorageStrategy.writeFileFromStream(sourceFileName, stream);
    const sourceFile = await assetStorageStrategy.readFileToBuffer(sourceFileIdentifier);
    const preview = await assetPreviewStrategy.generatePreviewImage(mimetype, sourceFile);
    const previewFileIdentifier = await assetStorageStrategy.writeFileFromBuffer(
      previewFileName,
      preview,
    );
    const type = getAssetType(mimetype);
    const {width, height} = this.getDimensions(type === AssetType.IMAGE ? sourceFile : preview);

    const asset = new Asset({
      type,
      width,
      height,
      name: path.basename(sourceFileName),
      fileSize: sourceFile.byteLength,
      mimeType: mimetype,
      source: sourceFileIdentifier,
      preview: previewFileIdentifier,
      focalPoint: null,
    });

    return asset;
    // return this.connection.manager.save(asset);
  }

  private getDimensions(imageFile: Buffer): { width: number; height: number } {
    try {
      const {width, height} = sizeOf(imageFile);
      return {width, height};
    } catch (e) {
      Logger.error(`Could not determine Asset dimensions: ` + e);
      return {width: 0, height: 0};
    }
  }

  private async getSourceFileName(fileName: string): Promise<string> {
    const {assetOptions} = this.configService;
    return this.generateUniqueName(fileName, (name, conflict) =>
      assetOptions.assetNamingStrategy.generateSourceFileName(name, conflict),
    );
  }

  private async getPreviewFileName(fileName: string): Promise<string> {
    const {assetOptions} = this.configService;
    return this.generateUniqueName(fileName, (name, conflict) =>
      assetOptions.assetNamingStrategy.generatePreviewFileName(name, conflict),
    );
  }

  /**
   * 生成资源的唯一标识
   * @param inputFileName
   * @param generateNameFn
   */
  private async generateUniqueName(
    inputFileName: string,
    generateNameFn: (fileName: string, conflictName?: string) => string,
  ): Promise<string> {
    const {assetOptions} = this.configService;
    let outputFileName: string | undefined;
    do {
      outputFileName = generateNameFn(inputFileName, outputFileName);
    } while (await assetOptions.assetStorageStrategy.fileExists(outputFileName));
    return outputFileName;
  }
}
