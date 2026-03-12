package ai.lala.app.ui

import androidx.compose.runtime.Composable
import ai.lala.app.MainViewModel
import ai.lala.app.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
