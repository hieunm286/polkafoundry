const { i18n } = require('./next-i18next.config')
const withImages = require("next-images")
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true' || process.env.ANALYZE === true,
})
module.exports = withBundleAnalyzer(
    withImages(
        {
            webpack5: false,
            webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
                if (!isServer) {
                    config.node = {
                        fs: 'empty',
                    }
                }
                return config
            },
            cssModule: true,
            i18n,
        }
    )
)
