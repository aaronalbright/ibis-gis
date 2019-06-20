'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var mapValues = _interopDefault(require('lodash/mapValues'));
var fetch = _interopDefault(require('node-fetch'));
var parser = _interopDefault(require('fast-xml-parser'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var shp = _interopDefault(require('shpjs'));

function parseRSS (_x, _x2) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(basin, example) {
    var feed, res, xmlData, _parser$parse, rss, items;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            feed = "https://www.nhc.noaa.gov/".concat(example ? 'rss_examples/' : '', "gis-").concat(basin, ".xml");
            _context.next = 3;
            return fetch(feed);

          case 3:
            res = _context.sent;
            _context.next = 6;
            return res.text();

          case 6:
            xmlData = _context.sent;
            _parser$parse = parser.parse(xmlData), rss = _parser$parse.rss;
            items = rss.channel.item;
            return _context.abrupt("return", items.filter(function (d) {
              return d.title.includes('[shp]');
            }));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

function fetchGIS (_ref) {
  var link = _ref.link,
      pubDate = _ref.pubDate;
  return (
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee() {
      var res, buffer, json;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch(link);

            case 2:
              res = _context.sent;
              _context.next = 5;
              return res.buffer();

            case 5:
              buffer = _context.sent;
              _context.next = 8;
              return shp(buffer);

            case 8:
              json = _context.sent;
              return _context.abrupt("return", json.map(function (d) {
                return _objectSpread({}, d, {
                  pubDate: pubDate
                });
              }));

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))
  );
}

var items = {
  forecast: 'Forecast',
  bestTrack: 'Preliminary Best Track',
  windField: 'Advisory Wind Field',
  stormSurge: 'Probabilistic Storm Surge 5ft'
};

var Ibis =
/**
 * Gets hurricane GIS data as geoJSON
 * @param {Object} [opts] - Options for getting data
 * @param {string}  [opts.name] - Name of storm to get GIS data. Must exist in NHC feed.
 * @param {string} [opts.basin] - Either 'at' for Atlantic or 'ep' for Eastern Pacific
 * @param {boolean} [opts.exampleData] - Used to get example active storm data
 */
function Ibis() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      name = _ref.name,
      _ref$basin = _ref.basin,
      basin = _ref$basin === void 0 ? 'at' : _ref$basin,
      _ref$exampleData = _ref.exampleData,
      exampleData = _ref$exampleData === void 0 ? false : _ref$exampleData;

  _classCallCheck(this, Ibis);

  _defineProperty(this, "find", function (filterVal) {
    return (
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        var shps, gis, r, stormName;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return parseRSS(_this.basin, _this.example);

              case 2:
                shps = _context.sent;

                if (_this.name) {
                  shps = shps.filter(function (d) {
                    return d.title.includes(_this.name.toUpperCase());
                  });
                  console.log(shps.length);
                }

                gis = shps.filter(function (d) {
                  return d.title.includes(filterVal);
                });
                r = /[A-Z]+\b/g;

                if (!(gis.length === 1)) {
                  _context.next = 11;
                  break;
                }

                stormName = gis[0].title.match(r);
                return _context.abrupt("return", {
                  name: stormName[0],
                  date: gis[0].pubDate,
                  fetchGIS: fetchGIS(gis[0])
                });

              case 11:
                return _context.abrupt("return", gis.map(function (d) {
                  var stormName = d.title.match(r);
                  return {
                    name: stormName[0],
                    date: d.pubDate,
                    fetchGIS: fetchGIS(d)
                  };
                }));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))
    );
  });

  _defineProperty(this, "get", mapValues(items, function (m) {
    return _this.find(m);
  }));

  this.name = name;
  this.basin = basin;
  this.example = exampleData;
};

module.exports = Ibis;
