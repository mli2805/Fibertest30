## Prettier

Let's use Prettier to format our code.
This way we can avoid code formatting discussions, focus on the code itself, and be consistent across the project.

To enforce this rule, the format on save is enabled, and default formatter is changed to Prettier (see workscpace settings at .vscode/settings.json).

### Hints

To prevent Prettier from formatting your <svg> element and thus saving space, place the <!-- prettier-ignore --> comment just before it.

## i18n

### Why ngx-translate?

We chose the ngx-translate library to handle i18n because we already use it in our other projects and also it is used in our @veex/sor, @veex/link-map, etc. libraries.

### Some rules

Let's stick to the following rules:

- use 'i18n' prefix for all keys. This simplifies searching for keys in the code
- every i18n key continues with a component class name which uses it, e.g. 'i18n.my-component.my-key'
- extremely common strings are in a 'i18n.common' (i18n/common/{lang}.json)

### Modules

Each lazy module has its own isolated strings set. This way we avoid having one big file with all the strings in the app, which is loaded at once. Instead, we load only the strings we need for the current module.

The common strings are in the i18n/common/{lang}.json files, they are loaded once, cached and merged to module's strings.

### Workflow

If you need to add a new string, put it only to the en.json file (no need to create empty keys in other languages). To make sure en.json is sorted alphabetically, the 'Sort JSON objects' extension can be used. After some time we'll provide the en.json and some {other_lang}.json to a translator and will expect the fully translated and ordered other_lang.json as a result. Then we just copy over the other_lang.json. 
