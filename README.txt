高清影视片库静态网站

文件说明：
- index.html：首页，包含轮播 Hero、分类入口、推荐区和排行榜区块。
- categories.html：分类总览页。
- category/：独立分类页与地区页。
- movie/：共 2000 个影片详情页，每页含播放器区域、影片正文与相关推荐。
- search.html：全站静态搜索和筛选页。
- assets/styles.css：清晰格式的站点样式。
- assets/site.js：清晰格式的交互与 HLS 初始化脚本。
- assets/hls-vendor-dru42stk.js：从上传素材保留的 HLS 播放依赖。

图片说明：
页面已按要求引用网站顶级目录的 1.jpg 到 150.jpg。将对应图片放到网站根目录即可显示封面和首页轮播图。

部署说明：
将本文件夹上传到任意静态服务器即可访问。播放器使用 HLS 播放源，建议通过 HTTP/HTTPS 服务器访问，而不是直接双击本地 HTML 文件。
