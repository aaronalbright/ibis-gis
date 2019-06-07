'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var fetch = _interopDefault(require('node-fetch'));
var shp = _interopDefault(require('shpjs'));
var parser = _interopDefault(require('fast-xml-parser'));

var Ibis =
/*#__PURE__*/
function () {
  function Ibis(_ref) {
    var name = _ref.name,
        _ref$basin = _ref.basin,
        basin = _ref$basin === void 0 ? 'at' : _ref$basin,
        _ref$example = _ref.example,
        example = _ref$example === void 0 ? false : _ref$example;

    _classCallCheck(this, Ibis);

    this.basin = basin;
    this.example = example;
    this.name = name;

    if (!this.name) {
      console.log('No storm name provided. Getting all active storms...');
    }
  }

  _createClass(Ibis, [{
    key: "forecast",
    value: function () {
      var _forecast = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", this.getShp('Forecast'));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function forecast() {
        return _forecast.apply(this, arguments);
      }

      return forecast;
    }()
  }, {
    key: "bestTrack",
    value: function () {
      var _bestTrack = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.getShp('Preliminary Best Track'));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function bestTrack() {
        return _bestTrack.apply(this, arguments);
      }

      return bestTrack;
    }()
  }, {
    key: "getShp",
    value: function () {
      var _getShp = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(shpTitle) {
        var hurricaneFeed, wantedGIS, res, buffer, geoJSON;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.parseRSS();

              case 2:
                hurricaneFeed = _context3.sent;

                if (!(hurricaneFeed.length == 0 && this.name)) {
                  _context3.next = 5;
                  break;
                }

                throw new Error("No GIS data found for storm ".concat(this.name.toUpperCase()));

              case 5:
                wantedGIS = hurricaneFeed.find(function (d) {
                  return d.title.includes(shpTitle);
                });
                _context3.next = 8;
                return fetch(wantedGIS.link);

              case 8:
                res = _context3.sent;
                _context3.next = 11;
                return res.buffer();

              case 11:
                buffer = _context3.sent;
                _context3.next = 14;
                return shp(buffer);

              case 14:
                geoJSON = _context3.sent;
                return _context3.abrupt("return", geoJSON);

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getShp(_x) {
        return _getShp.apply(this, arguments);
      }

      return getShp;
    }()
  }, {
    key: "parseRSS",
    value: function () {
      var _parseRSS = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4() {
        var _this = this;

        var feed, res, xmlData, _parser$parse, rss, items;

        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                feed = "https://www.nhc.noaa.gov/".concat(this.example ? 'rss_examples/' : '', "gis-").concat(this.basin, ".xml");
                _context4.next = 3;
                return fetch(feed);

              case 3:
                res = _context4.sent;
                _context4.next = 6;
                return res.text();

              case 6:
                xmlData = _context4.sent;
                // Destructure to simplify output
                _parser$parse = parser.parse(xmlData), rss = _parser$parse.rss;
                items = rss.channel.item; // Returns all shapefile links unless storm name is provided
                // All shapefiles are always parsed so the user can decide which ones they want downloaded

                return _context4.abrupt("return", items.filter(function (d) {
                  if (_this.name) {
                    return d.title.includes('[shp]') && d.title.includes(_this.name.toUpperCase());
                  } else {
                    return d.title.includes('[shp]');
                  }
                }));

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
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
