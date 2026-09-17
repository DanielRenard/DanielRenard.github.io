import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "../LightBetGame.css";

const SWORDS = [
  {
    name: "Red",
    color: "#ef4444",
    shape: "longsword",
  },
  {
    name: "Orange",
    color: "#f97316",
    shape: "katana",
  },
  {
    name: "Yellow",
    color: "#eab308",
    shape: "rapier",
  },
  {
    name: "Green",
    color: "#22c55e",
    shape: "scimitar",
  },
  {
    name: "Blue",
    color: "#3b82f6",
    shape: "claymore",
  },
  {
    name: "Purple",
    color: "#a855f7",
    shape: "broadsword",
  },
  {
    name: "Pink",
    color: "#ec4899",
    shape: "dagger",
  },
];

const MIN_GAME_TIME = 5000;

function LightBetGame({ startingLuck = 10 }) {
  const theme = useTheme();
  const [luck, setLuck] = useState(startingLuck);
  const [selectedColor, setSelectedColor] = useState("");
  const [bet, setBet] = useState("");
  const [activeLight, setActiveLight] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("Select a color and press your luck.");

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
      setMessage("Choose color alignment.");
      return;
    }

    // Validate luck
    if (!Number.isInteger(wager) || wager <= 0) {
      setMessage("Cast a whole-number sacrifice greater than zero.");
      return;
    }

    // Make sure the player can afford the bet
    if (wager > luck) {
      setMessage(`You only have ${luck} luck${luck === 1 ? "" : "s"}.`);
      return;
    }

    // Clear any previous timers
    clearTimeout(timerRef.current);
    clearTimeout(animationRef.current);

    // Deduct the wager immediately
    setLuck((currentLuck) => currentLuck - wager);

    setIsPlaying(true);
    setMessage("Your luck has been cast...");

    // Start the light sequence
    let currentIndex = Math.floor(Math.random() * SWORDS.length);
    let elapsed = 0;

    const cycleLight = () => {
      setActiveLight(currentIndex);

      currentIndex = (currentIndex + 1) % SWORDS.length;

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
          () => slowDown((index + 1) % SWORDS.length),
          180 + Math.random() * 100,
        );
      } else {
        // Final result
        finishGame(index);
      }
    };

    const finishGame = (winningIndex) => {
      setActiveLight(winningIndex);
      setIsPlaying(false);

      const winningColor = SWORDS[winningIndex].name;

      if (winningColor === selectedColor) {
        // Player picked the winning sword
        const winnings = wager * 2;

        setLuck((currentLuck) => currentLuck + winnings);

        setMessage(
          `FATE FAVORS YOU!!! ${winningColor} was selected. You won ${winnings} luck bucks!`,
        );
      } else {
        // Player picked the wrong sword
        setMessage(`${winningColor} was chosen. Your Luck has been spent.`);
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

  const selectedLight = SWORDS.find((light) => light.name === selectedColor);

  return (
    <Box
      className="light-bet-game"
      sx={{
        "--game-primary": theme.palette.primary.main,
        "--game-secondary": theme.palette.secondary.main,
        "--game-background": theme.palette.background.paper,
        "--game-text": theme.palette.text.primary,
        "--game-text-secondary": theme.palette.text.secondary,
        "--game-divider": theme.palette.divider,
        "--game-contrast": theme.palette.primary.contrastText,
      }}
    >
      {/* Decorative rivets */}
      <Box className="rivet rivet-top-left" />
      <Box className="rivet rivet-top-right" />
      <Box className="rivet rivet-bottom-left" />
      <Box className="rivet rivet-bottom-right" />
      <Typography className="machine-title">LUCK OF THE BLADE</Typography>
      <Box className="sword-panel">
        {SWORDS.map((sword, index) => (
          <Box
            key={sword.name}
            className={`sword ${sword.shape} ${
              activeLight === index ? "sword-active" : ""
            }`}
            sx={{
              "--sword-color": sword.color,
            }}
          >
            <Box className="blade" />
            <Box className="guard" />
            <Box className="grip" />
            <Box className="pommel" />
          </Box>
        ))}
      </Box>
      <Box className="controls">
        {/* Color selection */}
        <Box className="control-group">
          <Typography className="control-label">SWORD</Typography>

          <Select
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            disabled={isPlaying}
            displayEmpty
            size="small"
            className="game-select"
          >
            <MenuItem value="">Select</MenuItem>

            {SWORDS.map((light) => (
              <MenuItem key={light.name} value={light.name}>
                {light.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Bet amount */}
        <Box className="control-group">
          <Typography className="control-label">Try Your Luck</Typography>

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
          {isPlaying
            ? "The Light Carenes Through the Prism of Psylatiantan"
            : "Apply Luck"}
        </Button>
      </Box>
      {/* Score */}
      <Box className="score-display">
        <Typography className="score-label">Total Luck</Typography>

        <Typography className="score-value">{luck}</Typography>
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

          <Typography>Chosen Blade: {selectedLight.name}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default LightBetGame;
