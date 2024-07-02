# NOTE

`maizzle` folder is excluded from the csproj file, so it won't go to the search index.
Please open maizzle separately, for example in VSCode.


# Introduction

The primary challenge in writing HTML emails is the lack of a standard, leading to different email clients supporting various CSS styles inconsistently.

This results in layouts built with tables, inline styles, and the inability to use flex, grid, etc. 

Crafting an email that is compatible across many clients requires a skill set different from writing standard HTML code.

# Useful Websites

- [caniemail.com](https://www.caniemail.com)
- [goodemailcode.com](https://www.goodemailcode.com)

# Compatibility Checking

Currently, for compatibility checks, we use the local [MailPit](http://192.168.96.24:8025) demo service, which can show Html Check based on caniemail.

However, a more reliable method is to use services like [Litmus](https://www.litmus.com), which display how your email will look across different email clients.

# Implementation Details

Fibertest30.HtmlTemplates assembly is created, containing scriban templates for emails.
The templates are located in the `assets/html-templates`. Note: everything inside this folder is copied automatically to the project output. 

The `maillze-generated` folder is used exclusively for templates formed using Maizzle (this folder is cleared with each Maizzle run). 

If you prefer not to use Maizzle and write the Scriban template manually, you can create `html-templates/manual-templates` and work there. 

Backend, when forming emails, will use templates from the `html-templates`, relying only on Scriban without knowing anything about Maizzle.

Thus, template formation occurs in two stages:
- First, a template is created in Maizzle, which allows using tailwindcss and generates HTML with inline styles. Here, you need to escape `{{}}` with `@`, since Maizzle has its own template syntax, which we almost do not use. Also Maizzle, if Scriban syntax is used inside `class` attribute `class="@{{ object.value }}"`, Maizzle replaces the dot with an underscore, like this `class="{{ object_value }}"`, so we revert it back in `afterTransformers`.
- Then, this HTML template is dynamically fulfilled in a Scriban template to form the final HTML email (Backend).

# Workflow Example

Working with this can be somewhat challenging until you figure out how to simplify the process.

My workflow (as an example):
- Maizzle: open `Fibertest30.HtmlTemplates/maizzle` in VSCode.
- Maizzle: create a new template in `/src/templates`.
- Maizzle: `npm run build` compiles the template and places it in `Fibertest30.HtmlTemplates/html-templates/maillze-generated`.
- Scriban: `Fibertest30.QuickLaunch`, run a test that uses this template and adds a demo context. The result is in `Fibertest30.QuickLaunch/Results`.
- Compatibility check: use `./SendDemoEmail.ps1 my-template` to send an email to the demo [MailPit](http://192.168.96.24:8025) server, where you can view the HtmlCheck.
