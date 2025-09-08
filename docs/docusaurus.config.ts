import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Genkit Plugins',
  tagline:
    'Community Plugins for Genkit (OpenAI, Groq, Anthropic, Cohere, etc.)',
  favicon: 'img/logo.png',

  // Set the production url of your site here
  url: 'https://docs.firecompany.co',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/genkit-plugins/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'BloomLabsInc', // Usually your GitHub org/user name.
  projectName: 'genkit-plugins', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/BloomLabsInc/genkit-plugins/tree/main/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'GenKit Plugins',
      logo: {
        alt: 'GenKit Plugins',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'pluginsSidebar',
          label: 'Plugins',
        },
        {
          href: 'https://github.com/BloomLabsInc/genkit-plugins',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Plugins',
              to: '/docs/category/plugins',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/BloomLabsInc/genkit-plugins',
            },
          ],
        },
        {
          title: 'More from us',
          items: [
            {
              label: 'Fireview',
              href: 'https://fireview.dev',
            },
            {
              label: 'Giftit',
              href: 'https://giftit.social',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bloom Labs Inc`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
