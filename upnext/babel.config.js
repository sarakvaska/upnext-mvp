module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'react-native-iconify/babel',
      {
        icons: [
          'material-symbols:grid-on',
          'material-symbols:add-rounded',
          'material-symbols:person-rounded',
          'uil:create-dashboard',
          'material-symbols:search-rounded',
          'material-symbols:notifications-outline-rounded',
          'mingcute:notification-line',
        ],
      },
    ],
  ],
}; 