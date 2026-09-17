import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "../LightBetGame.css";

const LIGHTS = [
  { name: "Red", color: "#ef4444" },
  { name: "Orange", color: "#f97316" },
  { name: "Yellow", color: "#eab308" },
  { name: "Green", color: "#22c55e" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Purple", color: "#a855f7" },
  { name: "Pink", color: "#ec4899" },
];

const MIN_GAME_TIME = 5000;

function LightBetGame({ startingPoints = 10 }) {
  const [points, setPoints] = useState(startingPoints);
  const [selectedColor, setSelectedColor] = useState("");
  const [bet, setBet] = useState("");
  const [activeLight, setActiveLight] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState(
    "Select a color and place your bet."
  );

  const timerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(animationRef.current);
    };
  }, []);

  const startGame = () => {
    const wager = Number(bet);

    // Validate color
    if (!selectedColor) {
      setMessage("Choose a color first.");
      return;
    }

    // Validate bet
    if (!Number.isInteger(wager) || wager <= 0) {
      setMessage("Enter a whole-number bet greater than zero.");
      return;
    }

    // Make sure the player can afford the bet
    if (wager > points) {
      setMessage(`You only have ${points} point${points === 1 ? "" : "s"}.`);
      return;
    }

    // Clear any previous timers
    clearTimeout(timerRef.current);
    clearTimeout(animationRef.current);

    // Deduct the wager immediately
    setPoints((currentPoints) => currentPoints - wager);

    setIsPlaying(true);
    setMessage("The machine is spinning...");

    // Start the light sequence
    let currentIndex = Math.floor(Math.random() * LIGHTS.length);
    let elapsed = 0;

    const cycleLight = () => {
      setActiveLight(currentIndex);

      currentIndex = (currentIndex + 1) % LIGHTS.length;

      elapsed += 100;

      // Once we've reached the minimum time,
      // begin the slowdown phase.
      if (elapsed >= MIN_GAME_TIME) {
        slowDown(currentIndex);
        return;
      }

      animationRef.current = setTimeout(cycleLight, 100);
    };

    const slowDown = (index) => {
      setActiveLight(index);

      // Randomly determine whether to continue slowing down
      const shouldContinue = Math.random() > 0.35;

      if (shouldContinue) {
        animationRef.current = setTimeout(
          () => slowDown((index + 1) % LIGHTS.length),
          180 + Math.random() * 100
        );
      } else {
        // Final result
        finishGame(index);
      }
    };

    const finishGame = (winningIndex) => {
      setActiveLight(winningIndex);
      setIsPlaying(false);

      const winningColor = LIGHTS[winningIndex].name;

      if (winningColor === selectedColor) {
        const winnings = wager * 2;

        setPoints((currentPoints) => currentPoints + winnings);

        setMessage(
          `WIN! ${winningColor} was selected. You won ${winnings} points!`
        );
      } else {
        setMessage(
          `${winningColor} was selected. You lost your ${wager}-point bet.`
        );
      }
    };

    cycleLight();
  };

  const handleBetChange = (event) => {
    const value = event.target.value;

    // Only allow whole numbers
    if (value === "" || /^\d+$/.test(value)) {
      setBet(value);
    }
  };

  const selectedLight = LIGHTS.find(
    (light) => light.name === selectedColor
  );

  return (
    <Box className="light-bet-game">
      {/* Decorative rivets */}
      <Box className="rivet rivet-top-left" />
      <Box className="rivet rivet-top-right" />
      <Box className="rivet rivet-bottom-left" />
      <Box className="rivet rivet-bottom-right" />

      <Typography className="machine-title">
        COLOR CHANCE
      </Typography>

      <Box className="light-panel">
        {LIGHTS.map((light, index) => (
          <Box
            key={light.name}
            className={`game-light ${
              activeLight === index ? "light-active" : ""
            }`}
            sx={{
              "--light-color": light.color,
            }}
          />
        ))}
      </Box>

      <Box className="controls">
        {/* Color selection */}
        <Box className="control-group">
          <Typography className="control-label">
            COLOR
          </Typography>

          <Select
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            disabled={isPlaying}
            displayEmpty
            size="small"
            className="game-select"
          >
            <MenuItem value="">
              Select
            </MenuItem>

            {LIGHTS.map((light) => (
              <MenuItem key={light.name} value={light.name}>
                {light.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Bet amount */}
        <Box className="control-group">
          <Typography className="control-label">
            BET
          </Typography>

          <TextField
            value={bet}
            onChange={handleBetChange}
            disabled={isPlaying}
            size="small"
            placeholder="0"
            className="bet-field"
            inputProps={{
              inputMode: "numeric",
            }}
          />
        </Box>

        {/* Start button */}
        <Button
          variant="contained"
          onClick={startGame}
          disabled={isPlaying}
          className="start-button"
        >
          {isPlaying ? "RUNNING" : "START"}
        </Button>
      </Box>

      {/* Score */}
      <Box className="score-display">
        <Typography className="score-label">
          POINTS
        </Typography>

        <Typography className="score-value">
          {points}
        </Typography>
      </Box>

      {/* Status */}
      <Box className="status-display">
        <Typography
          className={`status-message ${
            message.startsWith("WIN") ? "win-message" : ""
          }`}
        >
          {message}
        </Typography>
      </Box>

      {/* Current selection indicator */}
      {selectedLight && !isPlaying && (
        <Box className="selection-display">
          <Box
            className="selection-dot"
            sx={{
              backgroundColor: selectedLight.color,
              boxShadow: `0 0 10px ${selectedLight.color}`,
            }}
          />

          <Typography>
            Betting on {selectedLight.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default LightBetGame;