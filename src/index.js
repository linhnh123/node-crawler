const Crawler = require('crawler');
const fs = require('fs');

const fileName = 'output.csv';
var currentDeep = 0;
const deepCrawling = 1;

if (process.argv[2]) {
  var crawler = new Crawler({
    callback: function(error, res, done) {
      if(error) {
        console.log(error);
      } else {
        var $ = res.$;
        const url = res.options.uri;
        const title = $('.Title').text();
        const author = $('.ReferenceSourceTG').text();
        const date = $('.Date').text();
        const data = `${url} | ${title} | ${author} | ${date}\n`;
        fs.writeFileSync(fileName, data, { flag: 'a' });
        if (currentDeep < deepCrawling) {
          currentDeep++;
          const moreLinks = $('#ctl00_cphContent_Article_LienQuan').find('.Item1');
          for(var i = 0; i < moreLinks.length; i++) {
            runCrawler(`https://www.thesaigontimes.vn${$(moreLinks[i]).find('a').attr('href')}`);
          }
        }
      }
      done();
    }
  });
  
  const runCrawler = function(link) {
    crawler.queue(link);
  };
  
  // Kiểm tra nếu file ouptput.csv đã tồn tại thì xoá nội dung
  if (fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, '');
  }
  
  fs.writeFileSync(fileName, 'URL | Title | Author | Date\n', { flag: 'a' });
  
  runCrawler(process.argv[2]);

  console.log('\n=============== Đang lấy dữ liệu ==========\n')
} else {
  console.log('\n============= Chưa có link ================\n');
}