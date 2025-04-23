module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/markdown-rendering-comparison/'  // GitHub 저장소 이름과 동일하게 설정
      : '/'
  }
