import _regeneratorRuntime from '@babel/runtime/regenerator';
import mapValues from 'lodash/mapValues';
import fetch from 'node-fetch';
import parser from 'fast-xml-parser';
import shp from 'shpjs';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function parseRSS (_x, _x2) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(basin, example) {
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

            if (items.length) {
              _context.next = 12;
              break;
            }

            console.log("Only one item found in feed: \"".concat(items.title, "\""));
            throw new Error('No active storms found');

          case 12:
            shps = items.filter(function (d) {
              return d.title.includes('[shp]') || d.title.includes('Summary');
            });
            return _context.abrupt("return", shps);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function formatGIS (_ref) {
  var link = _ref.link,
      pubDate = _ref.pubDate;
  return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
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
              return _objectSpread(_objectSpread({}, d), {}, {
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
  }));
}

function fetchData (shps, filterVal, name) {
  var gis;

  if (name && filterVal !== 'Wind Speed Probabilities') {
    gis = shps.filter(function (d) {
      return d.title.toLowerCase().includes(name) && d.title.includes(filterVal);
    });
  } else {
    gis = shps.filter(function (d) {
      return d.title.includes(filterVal);
    });
  }

  if (gis.length < 1) {
    if (filterVal == 'Forecast') {
      var arr = shps.filter(function (d) {
        return d.title.includes('Summary');
      });
      console.log(arr);
      gis = [{
        name: name,
        date: arr[0].pubDate
      }];
      console.log(gis);
    }

    throw new Error("Shapefile: \"".concat(filterVal, "\" not found for storm \"").concat(name, "\". It may not exist yet. Check https://www.nhc.noaa.gov/gis/ to ensure that it does."));
  } // matches first word before a SPACE and (


  var r = /(\w+)(?= \()/g;
  return gis.map(function (d) {
    var stormName = d.title.match(r) || [undefined]; // Ensures wind speed always fetched the polygon shapefile, not the point shapefile

    if (filterVal == 'Wind Speed Probabilities') {
      d.link = d.link.replace('halfDeg', '5km');
      stormName = ['Wind Speed Probabilities'];
    } // Always fetches latest Wind Field


    if (filterVal == 'Wind Field') {
      d.link = d.link.replace(/(\d+).zip/, 'latest.zip');
    }

    return {
      name: stormName[0],
      date: d.pubDate,
      fileName: d.link,
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

var Ibis = /*#__PURE__*/function () {
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
      return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
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
      }));
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
  /**
   * Init function to fetch data from shapefile
   * @param {String} filterVal Sets shapefile to search for in CSS feed
   * @param {Boolean} all
   * @returns {(Array|Object)} Array of data objects or singular data object
   */


  _createClass(Ibis, [{
    key: "fetch",
    value:
    /**
     * Custom fetch when RSS doesn't have current URL
     * @param {String} url URL from RSS feed or elsewhere
     * @returns {Pomise} Promise JSON object
     */
    function () {
      var _fetch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(url) {
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
