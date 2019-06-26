import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import mapValues from 'lodash/mapValues';
import fetch from 'node-fetch';
import parser from 'fast-xml-parser';
import _objectSpread from '@babel/runtime/helpers/objectSpread';
import shp from 'shpjs';

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
            // Usually, this is for offseason or when there are no active storms

            if (items.length) {
              _context.next = 11;
              break;
            }

            throw new Error(items.title);

          case 11:
            shps = items.filter(function (d) {
              return d.title.includes('[shp]');
            });
            return _context.abrupt("return", shps);

          case 13:
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

function fetchData (shps, filterVal) {
  var gis = shps.filter(function (d) {
    return d.title.includes(filterVal);
  });
  var r = /[A-Z]+\b/g;
  return gis.map(function (d) {
    var stormName = d.title.match(r);
    return {
      name: stormName[0],
      date: d.pubDate,
      fetchGIS: formatGIS(d)
    };
  });
}

var items = {
  forecast: 'Forecast',
  bestTrack: 'Preliminary Best Track',
  windField: 'Advisory Wind Field',
  stormSurge: 'Probabilistic Storm Surge 5ft'
};
/**
   * Gets hurricane GIS data as geoJSON
   * @param {object} [options]
   * @param {String}  [options.name] - Optionally get data for specific storm by name if it exists
   * @param {String} [options.basin=at] - Specify basin
   * @param {Boolean} [options.exampleData=false] - Used to get active storm data from example RSS feed
   */

var Ibis = function Ibis(_ref) {
  var _this = this;

  var _name = _ref.name,
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

                if (!_this.name) {
                  _context.next = 8;
                  break;
                }

                name = _this.name.toUpperCase();
                shps = shps.filter(function (d) {
                  return d.title.includes(name);
                });

                if (!(shps.length < 1)) {
                  _context.next = 8;
                  break;
                }

                throw new Error("".concat(name, " does not exist in the active storms feed."));

              case 8:
                data = fetchData(shps, filterVal);
                return _context.abrupt("return", all ? data : data[0]);

              case 10:
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
};

module.exports = Ibis;
