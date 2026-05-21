# Native health sync bridge

The web app now calls a native bridge when it is packaged for iPhone or Android. A normal browser or GitHub Pages install cannot request Apple Health or Android Health Connect permissions directly.

## Bridge name

Expose one of these objects to the web view:

- `window.ForgeHealth`
- `window.Capacitor.Plugins.ForgeHealth`
- `window.Capacitor.Plugins.HealthKit`
- `window.Capacitor.Plugins.HealthConnect`
- `window.ForgeGarmin`
- `window.Capacitor.Plugins.GarminHealth`

## Required methods

```js
await bridge.requestPermissions({
  source: "Apple Health",
  metrics: ["activeCalories", "steps", "restingHeartRate"],
});

const data = await bridge.readDailyActivity({
  source: "Apple Health",
  date: new Date().toISOString(),
  metrics: ["activeCalories", "steps", "restingHeartRate"],
});
```

The app also accepts method aliases:

- `requestAuthorization` or `authorize`
- `getDailyActivity` or `query`

## Expected response

```js
{
  activeCalories: 620,
  steps: 12800,
  restingHeartRate: 56
}
```

The meal planner applies the synced burn immediately and rebuilds the weekly plan.

## Platform notes

- iPhone: implement the bridge with HealthKit permissions for active energy burned, step count, and resting heart rate.
- Android: implement the bridge with Health Connect read permissions for active calories burned, steps, and resting heart rate.
- Garmin: use Garmin Health API/OAuth through an approved Garmin developer app, or let Garmin write to Health Connect and sync from Android there.
