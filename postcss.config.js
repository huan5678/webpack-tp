module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 5 versions',
        'Firefox >= 45',
        'iOS >= 8',
        'Safari >= 8',
        'ie >= 10'
      ]
    })
  ],
};
