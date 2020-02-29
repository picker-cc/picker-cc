import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {
  MutationCreateAssetsArgs,
  MutationUpdateAssetArgs,
  Permission,
  QueryAssetArgs,
  QueryAssetsArgs,
} from '@picker-cc/common/lib/generated-types';
// import { PaginatedList } from '@picker-cc/common/lib/shared-types';

import {Ctx} from '../..';
import {RequestContext} from '../..';
import {Allow} from '../..';
import {Logger} from '../../../config';
import {Asset} from '../../../entity';
import {AssetService} from '../../../service';

@Resolver('Asset')
export class AssetResolver {
  constructor(private assetService: AssetService) {
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async asset(@Args() args: QueryAssetArgs): Promise<Asset | undefined> {
    // return this.assetService.findOne(args.id);
    return undefined;
  }

  // @Query()
  // @Allow(Permission.ReadCatalog)
  // async assets(@Args() args: QueryAssetsArgs): Promise<PaginatedList<Asset>> {
  //   return this.assetService.findAll(args.options || undefined);
  // }

  @Mutation()
  @Allow(Permission.CreateCatalog)
  async createAssets(@Ctx() ctx: RequestContext, @Args() args: MutationCreateAssetsArgs): Promise<Asset[]> {
    // TODO: Is there some way to parellelize this while still preserving
    Logger.warn('上传了多少文件呢？');
    // the order of files in the upload? Non-deterministic IDs mess up the e2e test snapshots.
    const assets: Asset[] = [];
    Logger.info(args.input.length.toString());
    // args.input = JSON.parse(JSON.stringify(args.input))
    for (const input of args.input) {
      const asset = await this.assetService.create(ctx, input);
      assets.push(asset);
    }
    return assets;
  }

  // @Mutation()
  // @Allow(Permission.UpdateCatalog)
  // async updateAsset(@Ctx() ctx: RequestContext, @Args() { input }: MutationUpdateAssetArgs) {
  //   return this.assetService.update(ctx, input);
  // }
}
