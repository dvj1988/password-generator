import { useCallback, useEffect, useRef, useState } from "react";
import classes from "./App.module.css";
import { ReactComponent as CopySVG } from "./assets/copy.svg";
import clsx from "clsx";
import {
  generateRandomPassword,
  getConfigFromLocalStorage,
  saveConfigToLocalStorage,
} from "./utils";
import { SYMBOLS } from "./constants";

const Toast = ({ visible, hide }: { visible: boolean; hide: () => void }) => {
  const interval = useRef<number>();

  useEffect(() => {
    if (!visible) {
      return;
    }

    clearInterval(interval.current);

    interval.current = setInterval(() => {
      hide();
    }, 2000);

    return () => {
      clearInterval(interval.current);
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return <div className={classes.toast}>Copied to clipboard!</div>;
};

const SymbolButton = ({
  value,
  onToggle,
  selected,
}: {
  value: string;
  selected: boolean;
  onToggle: (value: string) => void;
}) => {
  return (
    <div
      className={clsx(classes.symbol, {
        [classes.selected]: selected,
      })}
      onClick={() => onToggle(value)}
    >
      {value}
    </div>
  );
};

function App() {
  const [config, setConfig] = useState(getConfigFromLocalStorage());
  const [password, setPassword] = useState(generateRandomPassword(config));
  const [showToast, setShowToast] = useState(false);

  const onGenerate = useCallback(() => {
    const newPassword = generateRandomPassword(config);
    setPassword(newPassword);
  }, [setPassword, config]);

  useEffect(() => {
    saveConfigToLocalStorage(config);
    onGenerate();
  }, [config, onGenerate]);

  const onCopy = () => {
    navigator.clipboard.writeText(password);
    setShowToast(true);
  };

  const onToggleUppercase = () => {
    setConfig((prev) => ({ ...prev, uppercase: !prev.uppercase }));
  };

  const onToggleLowercase = () => {
    setConfig((prev) => ({ ...prev, lowercase: !prev.lowercase }));
  };

  const onToggleNumbers = () => {
    setConfig((prev) => ({ ...prev, numbers: !prev.numbers }));
  };

  const onSymbolToggle = (symbol: string) => {
    setConfig((prev) => {
      const newSymbols = [...prev.symbols];
      const symbolIndex = newSymbols.indexOf(symbol);

      if (symbolIndex !== -1) {
        newSymbols.splice(symbolIndex, 1);
      } else {
        newSymbols.push(symbol);
      }

      return { ...prev, symbols: newSymbols };
    });
  };

  const onChangeLength: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setConfig((prev) => ({ ...prev, length: parseInt(value) }));
  };

  const onHideToast = () => {
    setShowToast(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.textWrapper}>
        <h2 className={classes.title}>Random Password Generator</h2>
      </div>
      <div className={classes.passwordWrapper}>
        <h4 className={classes.password}>{password}</h4>
        <CopySVG className={classes.copyImage} onClick={onCopy} />
      </div>
      <div className={classes.sliderWrapper}>
        <div>
          <label htmlFor="uppercase" className={classes.inputLabel}>
            Length ({config.length})
          </label>
        </div>
        <input
          type="range"
          name="length"
          id="length"
          value={config.length}
          min={8}
          max={20}
          onChange={onChangeLength}
        />
      </div>
      <div className={classes.textWrapper}>
        <input
          type="checkbox"
          name="numbers"
          id="numbers"
          checked={config.numbers}
          onChange={onToggleNumbers}
        />
        <label htmlFor="numbers" className={classes.inputLabel}>
          Numbers
        </label>
      </div>
      <div className={classes.textWrapper}>
        <input
          type="checkbox"
          name="uppercase"
          id="uppercase"
          checked={config.uppercase}
          onChange={onToggleUppercase}
        />
        <label htmlFor="uppercase" className={classes.inputLabel}>
          Upper case characters
        </label>
      </div>
      <div className={classes.textWrapper}>
        <input
          type="checkbox"
          name="lowercase"
          id="lowercase"
          checked={config.lowercase}
          onChange={onToggleLowercase}
        />
        <label htmlFor="lowercase" className={classes.inputLabel}>
          Lower case characters
        </label>
      </div>
      <div className={classes.symbolSection}>
        <h5>Symbols</h5>
        <div className={classes.symbolsWrapper}>
          {SYMBOLS.map((symbol) => (
            <SymbolButton
              value={symbol}
              selected={config.symbols.includes(symbol)}
              onToggle={onSymbolToggle}
            />
          ))}
        </div>
      </div>
      <Toast visible={showToast} hide={onHideToast} />
    </div>
  );
}

export default App;
