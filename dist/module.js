import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import fetch from 'node-fetch';
import shp from 'shpjs';
import parser from 'fast-xml-parser';

var Ibis =
/*#__PURE__*/
function () {
  /**
   * Gets hurricane GIS data as geoJSON
   * @param {Object} [opts] - Options for getting data
   * @param {string}  [opts.name] - Name of storm to get GIS data. Must exist in NHC feed.
   * @param {string} [opts.basin=at] - Either 'at' for Atlantic or 'ep' for Eastern Pacific
   * @param {boolean} [opts.exampleData=false] - Used to get example active storm data
   */
  function Ibis(_ref) {
    var _this = this;

    var name = _ref.name,
        _ref$basin = _ref.basin,
        basin = _ref$basin === void 0 ? 'at' : _ref$basin,
        _ref$exampleData = _ref.exampleData,
        exampleData = _ref$exampleData === void 0 ? false : _ref$exampleData;

    _classCallCheck(this, Ibis);

    this.basin = basin;
    this.example = exampleData;
    this.name = name;
    this.get = {};
    var items = {
      forecast: 'Forecast',
      bestTrack: 'Preliminary Best Track',
      windField: 'Advisory Wind Field',
      stormSurge: 'Probabilistic Storm Surge 5ft'
    };

    if (!this.name) {
      console.log('No storm name provided. Getting all active storms...');
    } else {
      console.log("Looking for GIS files for storm ".concat(this.name, "..."));
    }

    var _loop = function _loop(key) {
      if (items.hasOwnProperty(key)) {
        _this.get[key] = function () {
          return _this.getJSON(items[key]);
        };
      }
    };

    for (var key in items) {
      _loop(key);
    }
  }

  _createClass(Ibis, [{
    key: "getJSON",
    value: function () {
      var _getJSON = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(shpTitle) {
        var hurricaneFeed, wantedGIS, res, buffer, json;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.parseRSS();

              case 2:
                hurricaneFeed = _context.sent;

                if (!(hurricaneFeed.length == 0 && this.name)) {
                  _context.next = 5;
                  break;
                }

                throw new Error("No GIS data found for storm ".concat(this.name.toUpperCase()));

              case 5:
                wantedGIS = hurricaneFeed.find(function (d) {
                  return d.title.includes(shpTitle);
                });
                _context.next = 8;
                return fetch(wantedGIS.link);

              case 8:
                res = _context.sent;
                _context.next = 11;
                return res.buffer();

              case 11:
                buffer = _context.sent;
                _context.next = 14;
                return shp(buffer);

              case 14:
                json = _context.sent;
                return _context.abrupt("return", json);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getJSON(_x) {
        return _getJSON.apply(this, arguments);
      }

      return getJSON;
    }()
  }, {
    key: "parseRSS",
    value: function () {
      var _parseRSS = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var feed, res, xmlData, _parser$parse, rss, items;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                feed = "https://www.nhc.noaa.gov/".concat(this.example ? 'rss_examples/' : '', "gis-").concat(this.basin, ".xml");
                _context2.next = 3;
                return fetch(feed);

              case 3:
                res = _context2.sent;
                _context2.next = 6;
                return res.text();

              case 6:
                xmlData = _context2.sent;
                // Destructure to simplify output
                _parser$parse = parser.parse(xmlData), rss = _parser$parse.rss;
                items = rss.channel.item; // Returns all shapefile links unless storm name is provided
                // All shapefiles are always parsed so the user can decide which ones they want downloaded

                return _context2.abrupt("return", items.filter(function (d) {
                  if (_this2.name) {
                    return d.title.includes('[shp]') && d.title.includes(_this2.name.toUpperCase());
                  } else {
                    return d.title.includes('[shp]');
                  }
                }));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function parseRSS() {
        return _parseRSS.apply(this, arguments);
      }

      return parseRSS;
    }()
  }]);

  return Ibis;
}();

module.exports = Ibis;
