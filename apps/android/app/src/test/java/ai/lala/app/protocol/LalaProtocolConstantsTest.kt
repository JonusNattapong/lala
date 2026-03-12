package ai.lala.app.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class LalaProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", LalaCanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", LalaCanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", LalaCanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", LalaCanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", LalaCanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", LalaCanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", LalaCanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", LalaCanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", LalaCapability.Canvas.rawValue)
    assertEquals("camera", LalaCapability.Camera.rawValue)
    assertEquals("voiceWake", LalaCapability.VoiceWake.rawValue)
    assertEquals("location", LalaCapability.Location.rawValue)
    assertEquals("sms", LalaCapability.Sms.rawValue)
    assertEquals("device", LalaCapability.Device.rawValue)
    assertEquals("notifications", LalaCapability.Notifications.rawValue)
    assertEquals("system", LalaCapability.System.rawValue)
    assertEquals("photos", LalaCapability.Photos.rawValue)
    assertEquals("contacts", LalaCapability.Contacts.rawValue)
    assertEquals("calendar", LalaCapability.Calendar.rawValue)
    assertEquals("motion", LalaCapability.Motion.rawValue)
  }

  @Test
  fun cameraCommandsUseStableStrings() {
    assertEquals("camera.list", LalaCameraCommand.List.rawValue)
    assertEquals("camera.snap", LalaCameraCommand.Snap.rawValue)
    assertEquals("camera.clip", LalaCameraCommand.Clip.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", LalaNotificationsCommand.List.rawValue)
    assertEquals("notifications.actions", LalaNotificationsCommand.Actions.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", LalaDeviceCommand.Status.rawValue)
    assertEquals("device.info", LalaDeviceCommand.Info.rawValue)
    assertEquals("device.permissions", LalaDeviceCommand.Permissions.rawValue)
    assertEquals("device.health", LalaDeviceCommand.Health.rawValue)
  }

  @Test
  fun systemCommandsUseStableStrings() {
    assertEquals("system.notify", LalaSystemCommand.Notify.rawValue)
  }

  @Test
  fun photosCommandsUseStableStrings() {
    assertEquals("photos.latest", LalaPhotosCommand.Latest.rawValue)
  }

  @Test
  fun contactsCommandsUseStableStrings() {
    assertEquals("contacts.search", LalaContactsCommand.Search.rawValue)
    assertEquals("contacts.add", LalaContactsCommand.Add.rawValue)
  }

  @Test
  fun calendarCommandsUseStableStrings() {
    assertEquals("calendar.events", LalaCalendarCommand.Events.rawValue)
    assertEquals("calendar.add", LalaCalendarCommand.Add.rawValue)
  }

  @Test
  fun motionCommandsUseStableStrings() {
    assertEquals("motion.activity", LalaMotionCommand.Activity.rawValue)
    assertEquals("motion.pedometer", LalaMotionCommand.Pedometer.rawValue)
  }
}
