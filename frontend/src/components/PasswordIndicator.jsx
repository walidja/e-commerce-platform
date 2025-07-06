import React, { useState, useEffect } from "react";
import { Form, ProgressBar } from "react-bootstrap";
import zxcvbn from "zxcvbn";
import PasswordInput from "./PasswordInput";

const PasswordIndicator = ({
  password,
  setPassword,
  strength,
  setStrength,
}) => {
  const [feedback, setFeedback] = useState({ suggestions: [], warning: "" });

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setStrength(result.score);
      setFeedback(result.feedback);
    } else {
      setStrength(0);
      setFeedback({ suggestions: [], warning: "" });
    }
  }, [password]);

  const getStrengthVariant = (score) => {
    if (score > 4) {
      return "secondary";
    }
    return ["danger", "warning", "info", "success", "success"][score];
  };

  const getStrengthLabel = (score) => {
    if (score > 4) {
      return "";
    }
    return ["Too Weak", "Weak", "Medium", "Good", "Strong"][score];
  };

  const getProgressBarValue = (score) => {
    // Map zxcvbn score (0-4) to a percentage for the progress bar (0-100)
    return (score + 1) * 20; // +1 to ensure 0 score isn't 0%
  };

  return (
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label className="fw-bold text-gray-700">Password</Form.Label>
      <PasswordInput password={password} setPassword={setPassword} />
      {password && ( // Only show indicator if password is not empty
        <div className="mt-2">
          <ProgressBar
            variant={getStrengthVariant(strength)}
            now={getProgressBarValue(strength)}
            label={`${getStrengthLabel(strength)}`}
          />
          {feedback.warning && (
            <Form.Text className="text-danger">{feedback.warning}</Form.Text>
          )}
          {feedback.suggestions.length > 0 && (
            <Form.Text className="text-muted">
              Suggestions:
              <ul>
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </Form.Text>
          )}
        </div>
      )}
    </Form.Group>
  );
};

export default PasswordIndicator;
