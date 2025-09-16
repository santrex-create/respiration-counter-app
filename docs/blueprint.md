# **App Name**: BreatheEasy Monitor

## Core Features:

- Patient Information Form: Collect patient details such as age, gender, weight, and relevant medical history via a digital form. Retain for calculation, and store temporarily in-memory (not persisted to any database) only for the duration of the session.
- Activity/Condition Checklist: Present a checklist to capture patient's current activity level, body posture, stress level, and hydration status, as those factors influence respiration.
- Manual Rate Input: Provide an interface for manual entry of respiration rate.
- Rate Analysis: Analyze entered and received data, generate an output (normal/too high/too low) of whether the respiration rate is in a healthy range according to the given information.
- Graphical Display: Display the respiration rate as a graph over time, with key ranges highlighted based on patient profile.
- Smart Advice Tool: Provide customized advice. Based on a patient profile, use an LLM to produce smart contextual recommendations that promote wellbeing (e.g. tips for breathing exercises, stress reduction). The LLM should only provide generic medical advice; this is NOT intended as a diagnostic tool.
- Session Reset: Provide a reset button to clear current patient data and start a new session.

## Style Guidelines:

- Primary color: Deep gray (#4A4A4A) for a premium, modern look.
- Background color: Light gray (#F0F0F0) to provide a subtle contrast against the darker elements.
- Accent color: Electric blue (#7DF9FF) for interactive elements and data visualization, providing a pop of color against the monochrome palette.
- Font: 'Inter' sans-serif font for a modern, neutral look. Use 'Inter' for both headlines and body text.
- Use minimalist icons in white with a subtle blue glow effect.
- Maintain a clean, smartphone-compatible layout with ample spacing and easy-to-tap targets.
- Incorporate subtle transitions for loading data and displaying graphs.