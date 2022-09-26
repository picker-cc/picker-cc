import algoliasearch from "algoliasearch";
import { sanitize } from "isomorphic-dompurify";

const { ALGOLIA_SEARCH_KEY } = process.env;

const client = algoliasearch("BQ93464WAA", ALGOLIA_SEARCH_KEY);
const searchIndex = client.initIndex("docs");

// https://wesbos.com/sanitize-html-es6-template-strings
function sanitizer(strings, ...values) {
  const dirty = strings.reduce(
    (prev, next, i) => `${prev}${next}${values[i] || ""}`,
    ""
  );
  return sanitize(dirty);
}

module.exports = async (req, res) => {
  const { t } = req.query;
  const sanitizedSearchTerm = sanitizer`${t}`;

  try {
    const { hits: results } = await searchIndex.search(sanitizedSearchTerm, {
      hitsPerPage: 10,
      attributesToRetrieve: ["title", "url"],
      attributesToSnippet: ["content"],
      snippetEllipsisText: "…",
    });

    res.status(200).send(
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Search results for "${sanitizedSearchTerm}"</title>
          <link href="/docs/static/style.min.css" rel="stylesheet" />
        </head>
        <body class="pa5 mw7 center">
          <a class="flex items-center link eggplant hover-dragonfruit" href="/">
            <svg width="145" height="38" class="ma0 mr3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 145 38"><path fill="#300D4F" d="M12.31 37.946V28.42c0-.02.011-.04.03-.05l12.252-7.068a.055.055 0 00.029-.05v-2.708a.056.056 0 00-.085-.05l-12.14 7.004a.056.056 0 01-.085-.05v-2.71c0-.02.01-.039.028-.049l12.253-7.068a.059.059 0 00.029-.05v-2.708a.058.058 0 00-.085-.05l-12.14 7.003a.056.056 0 01-.086-.049v-2.709c0-.02.011-.039.03-.049l12.252-7.065a.056.056 0 00.029-.05V7.15a.12.12 0 00-.056-.098L12.367.015a.112.112 0 00-.113 0l-2.32 1.339a.056.056 0 000 .098l12.14 7.003a.058.058 0 010 .098l-2.32 1.338a.12.12 0 01-.114 0L7.443 2.856a.12.12 0 00-.12 0L5.01 4.193a.056.056 0 000 .098l12.138 7.004a.056.056 0 010 .099l-2.32 1.338a.12.12 0 01-.12 0L2.519 5.695a.12.12 0 00-.12 0L0 7.083V30.91c0 .02.01.04.029.049l2.348 1.355a.056.056 0 00.085-.05V8.603a.056.056 0 01.085-.049l2.35 1.355c.016.01.027.029.027.05V33.75c0 .02.01.04.028.05L7.3 35.156a.058.058 0 00.087-.05V11.442a.056.056 0 01.085-.05l2.348 1.354c.018.01.029.03.029.05v23.795c0 .02.01.039.027.05l2.355 1.353a.056.056 0 00.08-.049z"/><path fill="#300D4F" fill-rule="evenodd" d="M36.934 7.512v22.933c.01.242.195.44.436.466h2.478a.427.427 0 00.437-.43v-9.546a.23.23 0 01.23-.223h3.642c4.003 0 7.053-2.683 7.053-6.898s-2.688-6.731-7.014-6.731h-6.823a.427.427 0 00-.44.429zm10.845 6.302c0 2.162-1.296 4.064-3.583 4.064l-3.675-.003a.229.229 0 01-.23-.224v-7.548a.23.23 0 01.224-.224h3.68c2.403 0 3.584 1.697 3.584 3.935z" clip-rule="evenodd"/><path fill="#300D4F" d="M65.33 7.046h2.478a.427.427 0 01.44.429V24.8c0 3.935-3.222 6.34-6.996 6.34-3.698 0-6.919-2.424-6.919-6.34V7.475a.427.427 0 01.438-.43h2.44a.427.427 0 01.44.43v17.264c0 2.144 1.637 3.505 3.582 3.505 1.945 0 3.622-1.361 3.622-3.505V7.487a.503.503 0 01.476-.441zM76.767 18.83c-2.363-1.586-3.945-3.356-3.945-6.024 0-3.822 3.221-6.021 6.88-6.021 3.45 0 6.476 1.917 6.653 6.768a.46.46 0 01-.44.466h-2.267a.436.436 0 01-.439-.41c-.152-2.636-1.734-3.897-3.717-3.897-1.907 0-3.336 1.119-3.336 2.909 0 1.546.934 2.386 3.374 4.1l3.412 2.462c2.363 1.715 3.697 3.263 3.697 5.705 0 3.954-3.26 6.302-7.09 6.302-3.622 0-6.476-1.976-6.786-6.823a.436.436 0 01.44-.468h2.305a.45.45 0 01.438.411c.21 2.703 1.83 3.954 3.736 3.954 1.83 0 3.545-.988 3.545-3.3 0-1.438-.647-2.144-2.518-3.394l-3.942-2.74zM102.593 30.445v-10.03a.228.228 0 00-.229-.225h-7.299c-.124 0-.226.1-.229.224v10.03a.427.427 0 01-.439.428H91.92a.427.427 0 01-.44-.427V7.512a.427.427 0 01.44-.43h2.477a.427.427 0 01.44.43v9.585a.229.229 0 00.228.222h7.299a.228.228 0 00.229-.222V7.512a.429.429 0 01.439-.43h2.478a.427.427 0 01.439.43v22.95a.429.429 0 01-.439.43h-2.478a.442.442 0 01-.439-.447zM112.219 30.445V7.512a.426.426 0 01.438-.429h12.122a.424.424 0 01.439.429v1.995a.429.429 0 01-.439.428h-8.977a.23.23 0 00-.229.224v7.029a.229.229 0 00.229.224h6.176a.425.425 0 01.437.429v1.994a.423.423 0 01-.437.43h-6.176a.23.23 0 00-.229.223v7.309a.23.23 0 00.229.224h8.977c.239 0 .434.19.439.429v1.995a.44.44 0 01-.439.427h-12.122a.413.413 0 01-.438-.427z"/><path fill="#300D4F" fill-rule="evenodd" d="M137.035 20.47l3.659 9.975a.805.805 0 00.591.486h2.574a.437.437 0 00.419-.599l-4.136-10.57a.096.096 0 010-.079.093.093 0 01.057-.052c2.516-1.268 3.889-3.43 3.889-6.022 0-3.898-2.859-6.526-7.014-6.526h-6.786a.428.428 0 00-.438.429v22.933a.426.426 0 00.438.427h2.477a.425.425 0 00.439-.427v-9.901a.229.229 0 01.229-.223h3.393c.094 0 .178.06.209.148zm3.564-6.73c0 2.46-1.791 3.859-3.793 3.859l-3.354-.02a.23.23 0 01-.229-.224v-7.271a.209.209 0 01.21-.205h3.373c2.364 0 3.793 1.66 3.793 3.86z" clip-rule="evenodd"/></svg> <strong>DOCS</strong>
          </a>
          <h1 class="f1">Search results for “${sanitizedSearchTerm}”</h1>
          <ul class="list ma0 pa0">
            ${results
              .map(
                (result) =>
                  `<li class="bb b--smoke f5"><a href="${result.url}" class="pa4 db link eggplant hover-dragonfruit hover-bg-snow-light">
                    <strong class="db">${result.title}</strong>
                    <p class="ma0 search-snippet">${result._snippetResult.content.value}</p>
                  </a></li>`
              )
              .join("")}
          </ul>
          <footer class="f6 pv3 ph4 steel">
            <p class="ma0">Search powered by <a href="https://www.algolia.com/" rel="noreferrer" class="link eggplant hover-dragonfruit underline">Algolia</a></p>
            <p class="mt6 measure-wide">This page is the fallback search for when JavaScript search is unavailable. The docs are statically generated with <a href="https://www.11ty.dev/" rel="noreferrer" class="link eggplant hover-dragonfruit underline">11ty</a> but this page runs on <a href="https://vercel.com" rel="noreferrer" class="link eggplant hover-dragonfruit underline">Vercel</a> as a <a href="https://vercel.com/docs/serverless-functions/introduction" rel="noreferrer" class="link eggplant hover-dragonfruit underline">serverless function</a>. You can see <a href="https://github.com/pusher/docs/blob/main/api/search.js" rel="noreferrer" class="link eggplant hover-dragonfruit underline">the source code on&nbsp;Github</a>.</p>
          </footer>
        </body>
      </html>`
    );
  } catch (error) {
    res.status(500).send(`There was an error processing his request: ${error}`);
  }
};
