"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ControlPanel = function ControlPanel(props) {
  return React.createElement(
    "div",
    { id: "controlBoard", className: "text-center" },
    React.createElement(
      "h3",
      null,
      "Game of life"
    ),
    React.createElement(
      "p",
      null,
      React.createElement(
        "strong",
        null,
        "Generation:"
      ),
      React.createElement(
        "span",
        null,
        " ",
        props.generation,
        " "
      )
    ),
    React.createElement(
      "div",
      { id: "btnGroup" },
      React.createElement(
        "button",
        { className: "btn btn-outline-primary btn-block",
          onClick: function onClick() {
            return props.onRun();
          } },
        "Run"
      ),
      React.createElement(
        "button",
        { className: "btn btn-outline-warning btn-block",
          onClick: function onClick() {
            return props.onPause();
          } },
        "Pause"
      ),
      React.createElement(
        "button",
        { className: "btn btn-outline-secondary btn-block",
          onClick: function onClick() {
            return props.onClear();
          } },
        "Clear"
      )
    ),
    React.createElement(
      "p",
      null,
      React.createElement(
        "a",
        { target: "_blank", href: "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" },
        "More about the game"
      )
    ),
    React.createElement(
      "p",
      null,
      "Click to add cells at any time. Enjoy the pattern!"
    )
  );
};

var GridBoard = function (_React$Component) {
  _inherits(GridBoard, _React$Component);

  function GridBoard(props) {
    _classCallCheck(this, GridBoard);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {
      matrix: [],
      ctx: null
    };
    return _this;
  }

  GridBoard.prototype.componentDidMount = function componentDidMount() {
    this.drawLife();
  };

  GridBoard.prototype.drawLife = function drawLife() {
    var matrix = this.props.matrix,
        // matrix = map //what's difference??
    w = this.props.grid.width,
        h = this.props.grid.height,
        cube = this.props.grid.cellSize,
        ctx = this.refs.grid.getContext("2d");

    ctx.fillStyle = 'lime';
    for (var row = 0; row < matrix.length; row++) {
      for (var col = 0; col < matrix[row].length; col++) {

        if (matrix[row][col]) {
          ctx.fillRect(row * cube, col * cube, cube - 1, cube - 1);
        } else {
          ctx.clearRect(row * cube, col * cube, cube - 1, cube - 1);
        }
      }
    }

    this.setState({
      ctx: ctx,
      matrix: matrix
    });
  };

  GridBoard.prototype.cleanMap = function cleanMap(map) {
    var w = this.props.grid.width,
        h = this.props.grid.height,
        cube = this.props.grid.cellSize,
        ctx = this.state.ctx;
    ctx.clearRect(0, 0, w, h);
    this.setState({ matrix: map });
  };

  GridBoard.prototype.handleClick = function handleClick(e) {
    var box = document.getElementById("gameBoard"),
        matrix = this.state.matrix,
        cube = this.props.grid.cellSize,
        ctx = this.state.ctx;

    var cubex = Math.round((e.pageX - box.offsetTop - 10) / 10),
        cubey = Math.round((e.pageY - box.offsetLeft - 10) / 10);

    ctx.fillStyle = 'lime';

    if (matrix[cubex][cubey]) {
      matrix[cubex][cubey] = false;
      ctx.clearRect(cubex * cube, cubey * cube, cube - 1, cube - 1);
    } else {
      matrix[cubex][cubey] = true;
      ctx.fillRect(cubex * cube, cubey * cube, cube - 1, cube - 1);
    }

    this.setState({
      matrix: matrix
    }, function () {
      this.props.newMatrix(this.state.matrix);
    });
  };

  GridBoard.prototype.render = function render() {
    return React.createElement(
      "div",
      { id: "gameBoard" },
      "                  ",
      React.createElement("canvas", {
        ref: "grid",
        width: this.props.grid.width,
        height: this.props.grid.height,
        onClick: this.handleClick.bind(this)
      })
    );
  };

  return GridBoard;
}(React.Component);

var App = function (_React$Component2) {
  _inherits(App, _React$Component2);

  function App() {
    _classCallCheck(this, App);

    var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this2.state = {
      generation: 0,
      grid: {
        width: 600,
        height: 400,
        cellSize: 10
      },
      matrix: [],
      neighborsMap: []
    };
    return _this2;
  }

  App.prototype.componentWillMount = function componentWillMount() {
    this.setupArrays();
  };

  App.prototype.setupArrays = function setupArrays() {
    var lifeMap = [];
    var neighboursMap = [];
    var w = this.state.grid.width / this.state.grid.cellSize;
    var h = this.state.grid.height / this.state.grid.cellSize;
    //let w=6, h=4;
    for (var row = 0; row < w; row += 1) {
      lifeMap.push([]);
      neighboursMap.push([]);
      for (var col = 0; col < h; col += 1) {
        lifeMap[row][col] = Boolean(Math.round(Math.random()));
        // make the game more fun is connect the conner so every cell has 8 neighbors
        if (row == 0 && col == 0) {
          //top left coner
          neighboursMap[row][col] = { ns: [[row, col + 1], [row + 1, col], [row + 1, col + 1]] };
        } else if (row == 0 && col == h - 1) {
          //top right coner
          neighboursMap[row][col] = { ns: [[row, col - 1], [row + 1, col], [row + 1, col - 1]] };
        } else if (row == w - 1 && col == 0) {
          //bottom left coner
          neighboursMap[row][col] = { ns: [[row, col + 1], [row - 1, col], [row - 1, col + 1]] };
        } else if (row == w - 1 && col == h - 1) {
          // bottom right coner
          neighboursMap[row][col] = { ns: [[row, col - 1], [row - 1, col], [row - 1, col - 1]] };
        } else if (row == 0) {
          //top line
          neighboursMap[row][col] = { ns: [[row, col - 1], [row, col + 1], [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]] };
        } else if (row == w - 1) {
          //bottom line
          neighboursMap[row][col] = { ns: [[row, col - 1], [row, col + 1], [row - 1, col - 1], [row - 1, col], [row - 1, col + 1]] };
        } else if (col == 0) {
          //very left line
          neighboursMap[row][col] = { ns: [[row - 1, col], [row - 1, col + 1], [row, col + 1], [row + 1, col], [row + 1, col + 1]] };
        } else if (col == h - 1) {
          //very right line
          neighboursMap[row][col] = { ns: [[row, col - 1], [row - 1, col - 1], [row + 1, col - 1], [row + 1, col], [row - 1, col]] };
        } else {
          neighboursMap[row][col] = { ns: [[row - 1, col - 1], [row - 1, col], [row - 1, col + 1], [row, col - 1], [row, col + 1], [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]] };
        }
      }
    }
    this.setState({
      matrix: lifeMap,
      neighborsMap: neighboursMap
    });
  };

  App.prototype.componentDidMount = function componentDidMount() {
    this.startLife();
  };

  App.prototype.startLife = function startLife() {
    var newLifes = setInterval(this.cycleLife.bind(this), 500);
    this.setState({ newLifes: newLifes });
  };

  App.prototype.cycleLife = function cycleLife() {
    var matrix = this.state.matrix;
    var neighbours = this.state.neighborsMap;
    //let newGrid = this.state.matrix.slice();
    var newGrid = [];
    var gen = this.state.generation;
    var lns = 0;

    for (var row = 0; row < matrix.length; row++) {
      newGrid.push([]);
      for (var col = 0; col < matrix[row].length; col++) {
        //neighbours[row][col].ns is a nested array [3,5],[4,7]

        var liveNs = neighbours[row][col].ns.map(function (ele) {
          return matrix[ele[0]][ele[1]];
        });
        liveNs = liveNs.filter(function (val) {
          return val === true;
        });
        lns = liveNs.length;
        newGrid[row][col] = lns;

        if (matrix[row][col] === true) {

          if (newGrid[row][col] < 2 || newGrid[row][col] > 3) {
            newGrid[row][col] = false;
          }
          if (newGrid[row][col] == 2 || newGrid[row][col] == 3) {
            newGrid[row][col] = true;
          }
        } else {
          //dead cell with exactly three live neighbours
          if (newGrid[row][col] == 3) {
            newGrid[row][col] = true;
          } else {
            newGrid[row][col] = false;
          }
        }
      }
    }
    gen += 1;

    this.setState({
      matrix: newGrid,
      generation: gen
    }, function () {
      this.refs.canvasMap.drawLife(this.state.matrix);
    });
  };

  App.prototype.onRun = function onRun() {
    this.startLife();
  };

  App.prototype.onPause = function onPause() {
    clearInterval(this.state.newLifes);
  };

  App.prototype.onClear = function onClear() {
    clearInterval(this.state.newLifes);
    var matrix = this.state.matrix;

    var cleanMap = matrix.map(function (ele) {
      return ele.map(function (element) {
        element = false;
        return element;
      });
    });

    this.setState({
      generation: 0,
      matrix: cleanMap
    }, function () {
      this.refs.canvasMap.cleanMap(this.state.matrix);
    });
  };

  App.prototype.handleNewMatrix = function handleNewMatrix(newMatrix) {
    this.setState({
      matrix: newMatrix
    });
  };

  App.prototype.render = function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(GridBoard, {
        ref: "canvasMap",
        grid: this.state.grid,
        matrix: this.state.matrix,
        newMatrix: this.handleNewMatrix.bind(this)
      }),
      React.createElement(ControlPanel, {
        onRun: this.onRun.bind(this),
        onPause: this.onPause.bind(this),
        onClear: this.onClear.bind(this),
        generation: this.state.generation })
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("container"));