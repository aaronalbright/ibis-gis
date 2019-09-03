'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
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
    var feed, res, xmlData, _parser$parse, rss, items, shps;

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
            items = rss.channel.item; // Throws when the feed only has one result (no GIS products)
            // Usually, this is for off-season or when there are no active storms

            if (!items.length) {
              console.log("Only one item found in feed: \"".concat(items.title, "\""));
              console.log('Exiting...');
              process.exit();
            }

            shps = items.filter(function (d) {
              return d.title.includes('[shp]');
            });
            return _context.abrupt("return", shps);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

function formatGIS (_ref) {
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

              if (!json.length) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return", json.map(function (d) {
                return _objectSpread({}, d, {
                  pubDate: pubDate
                });
              }));

            case 13:
              json.pubDate = pubDate;
              return _context.abrupt("return", json);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))
  );
}

function fetchData (shps, filterVal, name) {
  var gis;

  if (name && filterVal !== 'Wind Speed Probabilities') {
    gis = shps.filter(function (d) {
      return d.title.toLowerCase().includes(name) && d.title.includes(filterVal);
    });

    if (gis.length < 1) {
      console.error("\"".concat(name, "\" does not exist in the active storms feed."));
    }
  } else {
    gis = shps.filter(function (d) {
      return d.title.includes(filterVal);
    });
  }

  if (gis.length < 1) {
    throw new Error("Shapefile: \"".concat(filterVal, "\" not found for storm \"").concat(name, "\". It may not exist yet. Check https://www.nhc.noaa.gov/gis/ to ensure that it does."));
  } // matches first word before a SPACE and (


  var r = /(\w+)(?= \()/g;
  return gis.map(function (d) {
    var stormName = d.title.match(r) || [undefined]; // Ensures wind speed always fetched the polygon shapefile, not the point shapefile

    if (filterVal == 'Wind Speed Probabilities') {
      d.link = d.link.replace('halfDeg', '5km');
      stormName = ['Wind Speed Probabilities'];
    }

    return {
      name: stormName[0],
      date: d.pubDate,
      fetchGIS: formatGIS(d)
    };
  });
}

var items = {
  forecast: 'Forecast',
  windSpeed: 'Wind Speed Probabilities',
  bestTrack: 'Preliminary Best Track',
  windField: 'Wind Field',
  stormSurge: 'Probabilistic Storm Surge 5ft'
};
/**
 * Gets hurricane GIS data as geoJSON
 * @param {Object} options
 * @param {String}  [options.name] - Optionally get data for specific storm by name if it exists
 * @param {String} [options.basin=at] - Specify basin
 * @param {Boolean} [options.exampleData=false] - Used to get active storm data from example RSS feed
 */

var Ibis =
/*#__PURE__*/
function () {
  function Ibis() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _name = _ref.name,
        _ref$basin = _ref.basin,
        basin = _ref$basin === void 0 ? 'at' : _ref$basin,
        _ref$exampleData = _ref.exampleData,
        exampleData = _ref$exampleData === void 0 ? false : _ref$exampleData;

    _classCallCheck(this, Ibis);

    _defineProperty(this, "init", function (filterVal, all) {
      return (
        /*#__PURE__*/
        _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var shps, name, data;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return parseRSS(_this.basin, _this.example);

                case 2:
                  shps = _context.sent;
                  name = _this.name ? _this.name.toLowerCase() : undefined;
                  data = fetchData(shps, filterVal, name);
                  return _context.abrupt("return", all ? data : data[0]);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }))
      );
    });

    _defineProperty(this, "get", mapValues(items, function (m) {
      return _this.init(m, false);
    }));

    _defineProperty(this, "getAll", mapValues(items, function (m) {
      return _this.init(m, true);
    }));

    this.name = _name;
    this.basin = basin;
    this.example = exampleData;
  }

  _createClass(Ibis, [{
    key: "fetch",

    /**
     * Custom fetch when RSS doesn't have current URL
     */
    value: function () {
      var _fetch = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(url) {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return formatGIS({
                  link: url,
                  pubDate: null
                })();

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      return fetch;
    }()
  }]);

  return Ibis;
}();

module.exports = Ibis;
