export function checkRedFlags(concern, answers) {
  if (!answers || Object.keys(answers).length === 0) {
    return { priority: "normal", alertTriggered: false };
  }

  let alertTriggered = false;

  switch (concern) {
    case "chest_pain": {
      const severePain = parseInt(answers.severity, 10) >= 8;
      const breathingDifficulty = answers.breathing === "Yes";
      const sweating = answers.sweating === "Yes";
      
      if (severePain && (breathingDifficulty || sweating)) {
        alertTriggered = true;
      }
      break;
    }
    case "difficulty_breathing": {
      const sudden = answers.speed === "Suddenly";
      const chestPain = answers.chest_pain === "Yes";
      if (sudden && chestPain) {
        alertTriggered = true;
      }
      break;
    }
    case "headache": {
      const severe = parseInt(answers.severity, 10) >= 8;
      const sudden = answers.onset_speed === "Suddenly";
      const vision = answers.vision === "Yes";
      if (severe && (sudden || vision)) {
        alertTriggered = true;
      }
      break;
    }
    case "abdominal_pain": {
      const severe = parseInt(answers.severity, 10) >= 8;
      const fever = answers.fever === "Yes";
      if (severe && fever) {
        alertTriggered = true;
      }
      break;
    }
    case "fever": {
      const respiratory = answers.respiratory === "Yes";
      const bodyAches = answers.body_aches === "Yes";
      const rash = answers.rash === "Yes";
      // This is just simulated logic for demonstration
      if (respiratory && bodyAches && rash) {
        alertTriggered = true;
      }
      break;
    }
    // Add logic for other concerns as needed
    default:
      alertTriggered = false;
  }

  return {
    priority: alertTriggered ? "high" : "normal",
    alertTriggered
  };
}
