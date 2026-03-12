package ai.lala.app.node

import ai.lala.app.protocol.LalaCalendarCommand
import ai.lala.app.protocol.LalaCameraCommand
import ai.lala.app.protocol.LalaCapability
import ai.lala.app.protocol.LalaContactsCommand
import ai.lala.app.protocol.LalaDeviceCommand
import ai.lala.app.protocol.LalaLocationCommand
import ai.lala.app.protocol.LalaMotionCommand
import ai.lala.app.protocol.LalaNotificationsCommand
import ai.lala.app.protocol.LalaPhotosCommand
import ai.lala.app.protocol.LalaSmsCommand
import ai.lala.app.protocol.LalaSystemCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  private val coreCapabilities =
    setOf(
      LalaCapability.Canvas.rawValue,
      LalaCapability.Device.rawValue,
      LalaCapability.Notifications.rawValue,
      LalaCapability.System.rawValue,
      LalaCapability.Photos.rawValue,
      LalaCapability.Contacts.rawValue,
      LalaCapability.Calendar.rawValue,
    )

  private val optionalCapabilities =
    setOf(
      LalaCapability.Camera.rawValue,
      LalaCapability.Location.rawValue,
      LalaCapability.Sms.rawValue,
      LalaCapability.VoiceWake.rawValue,
      LalaCapability.Motion.rawValue,
    )

  private val coreCommands =
    setOf(
      LalaDeviceCommand.Status.rawValue,
      LalaDeviceCommand.Info.rawValue,
      LalaDeviceCommand.Permissions.rawValue,
      LalaDeviceCommand.Health.rawValue,
      LalaNotificationsCommand.List.rawValue,
      LalaNotificationsCommand.Actions.rawValue,
      LalaSystemCommand.Notify.rawValue,
      LalaPhotosCommand.Latest.rawValue,
      LalaContactsCommand.Search.rawValue,
      LalaContactsCommand.Add.rawValue,
      LalaCalendarCommand.Events.rawValue,
      LalaCalendarCommand.Add.rawValue,
    )

  private val optionalCommands =
    setOf(
      LalaCameraCommand.Snap.rawValue,
      LalaCameraCommand.Clip.rawValue,
      LalaCameraCommand.List.rawValue,
      LalaLocationCommand.Get.rawValue,
      LalaMotionCommand.Activity.rawValue,
      LalaMotionCommand.Pedometer.rawValue,
      LalaSmsCommand.Send.rawValue,
    )

  private val debugCommands = setOf("debug.logs", "debug.ed25519")

  @Test
  fun advertisedCapabilities_respectsFeatureAvailability() {
    val capabilities = InvokeCommandRegistry.advertisedCapabilities(defaultFlags())

    assertContainsAll(capabilities, coreCapabilities)
    assertMissingAll(capabilities, optionalCapabilities)
  }

  @Test
  fun advertisedCapabilities_includesFeatureCapabilitiesWhenEnabled() {
    val capabilities =
      InvokeCommandRegistry.advertisedCapabilities(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          voiceWakeEnabled = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
        ),
      )

    assertContainsAll(capabilities, coreCapabilities + optionalCapabilities)
  }

  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands = InvokeCommandRegistry.advertisedCommands(defaultFlags())

    assertContainsAll(commands, coreCommands)
    assertMissingAll(commands, optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        defaultFlags(
          cameraEnabled = true,
          locationEnabled = true,
          smsAvailable = true,
          motionActivityAvailable = true,
          motionPedometerAvailable = true,
          debugBuild = true,
        ),
      )

    assertContainsAll(commands, coreCommands + optionalCommands + debugCommands)
  }

  @Test
  fun advertisedCommands_onlyIncludesSupportedMotionCommands() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        NodeRuntimeFlags(
          cameraEnabled = false,
          locationEnabled = false,
          smsAvailable = false,
          voiceWakeEnabled = false,
          motionActivityAvailable = true,
          motionPedometerAvailable = false,
          debugBuild = false,
        ),
      )

    assertTrue(commands.contains(LalaMotionCommand.Activity.rawValue))
    assertFalse(commands.contains(LalaMotionCommand.Pedometer.rawValue))
  }

  private fun defaultFlags(
    cameraEnabled: Boolean = false,
    locationEnabled: Boolean = false,
    smsAvailable: Boolean = false,
    voiceWakeEnabled: Boolean = false,
    motionActivityAvailable: Boolean = false,
    motionPedometerAvailable: Boolean = false,
    debugBuild: Boolean = false,
  ): NodeRuntimeFlags =
    NodeRuntimeFlags(
      cameraEnabled = cameraEnabled,
      locationEnabled = locationEnabled,
      smsAvailable = smsAvailable,
      voiceWakeEnabled = voiceWakeEnabled,
      motionActivityAvailable = motionActivityAvailable,
      motionPedometerAvailable = motionPedometerAvailable,
      debugBuild = debugBuild,
    )

  private fun assertContainsAll(actual: List<String>, expected: Set<String>) {
    expected.forEach { value -> assertTrue(actual.contains(value)) }
  }

  private fun assertMissingAll(actual: List<String>, forbidden: Set<String>) {
    forbidden.forEach { value -> assertFalse(actual.contains(value)) }
  }
}
