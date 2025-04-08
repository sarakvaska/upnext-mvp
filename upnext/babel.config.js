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
          'material-symbols:upload',
          'material-symbols:add-circle-outline-rounded', 
          'material-symbols:arrow-back-rounded',
          'material-symbols:arrow-forward-rounded',
          'material-symbols:arrow-upward-rounded',
          'material-symbols:arrow-downward-rounded',
          'material-symbols:arrow-left-rounded',
          'material-symbols:arrow-right-rounded',
          'material-symbols:link',
        ],
      },
    ],
  ],
}; 