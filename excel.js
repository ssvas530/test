var xl = require('excel4node');
var Path = require('path');
var ObjectID = require("mongodb").ObjectID;
var moment = require('moment-timezone');
moment.tz.setDefault('Asia/Kolkata');

function getDate(dateMill) {
   var d = moment(dateMill);
   return d.toDate();
}

function create(result, req, res, next) {
   // Create a new instance of a Workbook class
   var wb = new xl.Workbook({
      defaultFont: {
         size: 12,
         color: '#000000'
      }
   });

   // Create a reusable style
   var s_h_normal = wb.createStyle({
      alignment: { // §18.8.1
         horizontal: 'left',
         vertical: 'center',
         wrapText: true
      },
      font: {
         color: '#000000',
         size: 10,
         bold: false
      },
      border: { // §18.8.4 border (Border)
         left: {
            style: 'none', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
            color: '#000000' // HTML style hex value
         },
         right: {
            style: 'none',
            color: '#000000'
         },
         top: {
            style: 'none',
            color: '#000000'
         },
         bottom: {
            style: 'none',
            color: '#000000'
         }
      }
   });

   var s_h_title = wb.createStyle({
      alignment: { // §18.8.1
         horizontal: 'center',
         vertical: 'center',
         wrapText: true
      },
      font: {
         color: '#000000',
         size: 10,
         bold: false
      },
      border: { // §18.8.4 border (Border)
         left: {
            style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
            color: '#000000' // HTML style hex value
         },
         right: {
            style: 'thin',
            color: '#000000'
         },
         top: {
            style: 'thin',
            color: '#000000'
         },
         bottom: {
            style: 'thin',
            color: '#000000'
         }
      }
      // ,
      // fill: { // §18.8.20 fill (Fill)
      //    type: 'pattern', // Currently only 'pattern' is implimented. Non-implimented option is 'gradient'
      //    patternType: 'solid', //§18.18.55 ST_PatternType (Pattern Type)
      //    bgColor: '#C0C0C0', // HTML style hex value. optional. defaults to black
      //    fgColor: '#C0C0C0' // HTML style hex value. required.
      // }
   });
   var s_o_normal = wb.createStyle({
      alignment: { // §18.8.1
         horizontal: 'left',
         vertical: 'center',
         wrapText: true
      },
      font: {
         color: '#000000',
         size: 10,
         bold: false
      },
      border: { // §18.8.4 border (Border)
         left: {
            style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
            color: '#000000' // HTML style hex value
         },
         right: {
            style: 'thin',
            color: '#000000'
         },
         top: {
            style: 'thin',
            color: '#000000'
         },
         bottom: {
            style: 'thin',
            color: '#000000'
         }
      }
   });
   var m_row = 1;
   var defaultColWidth = 30;
   // Add Worksheets to the workbook
   var ws = wb.addWorksheet('Report', {
      'sheetFormat': {
         //   'baseColWidth': Integer, // Defaults to 10. Specifies the number of characters of the maximum digit width of the normal style's font. This value does not include margin padding or extra padding for gridlines. It is only the number of characters.,
         'defaultColWidth': defaultColWidth
            //   'thickBottom': Boolean, // 'True' if rows have a thick bottom border by default.
            //   'thickTop': Boolean // 'True' if rows have a thick top border by default.
      }
   });
   var headers = result.headers;
   var ii = 0;
   headers.map(function(o) {
      ii++;
      ws.cell(m_row, ii)
         .string(o)
         .style(s_h_title);
   });
   var rows = result.data.length;
   for (i = 0; i < rows; i++) {
      m_row++;
      ws.cell(m_row, 1)
         .string(moment(result.data[i].createdAt).utcOffset(330).format('DD-MM-YYYY'))
         .style(s_o_normal);
      ws.cell(m_row, 2)
         .string(result.data[i].material.quo ? result.data[i].material.quo.toString() : '')
         .style(s_o_normal);
      ws.cell(m_row, 3)
         .string(result.data[i].material.act ? result.data[i].material.act.toString() : '')
         .style(s_o_normal);
      ws.cell(m_row, 4)
         .string(result.data[i].scrap ? result.data[i].scrap.toString() : '')
         .style(s_o_normal);
   }
   m_row++;
   for (i = 1; i < 6; i++) {
      ws.cell(m_row, i)
         .string('')
         .style(s_h_normal);
   }
   var filename = 'a_' + moment(Date.now()).utcOffset(330).format('DD_MM_YYYY_HH_mm_ss') + '.xlsx';
   var filepath = Path.join(__dirname, './temp/xls/' + filename);
   wb.write(filepath, function(err, stats) {
      if (err) return next(err);
      return res.sendFile(Path.resolve(filepath));
   });

}

module.exports = {
   create: create
};
