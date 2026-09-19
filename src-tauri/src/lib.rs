fn decode_base64(input: &str) -> Result<Vec<u8>, String> {
  let mut out = Vec::with_capacity(input.len() * 3 / 4);
  let mut buf: u32 = 0;
  let mut bits = 0;

  for b in input.bytes() {
    let val = match b {
      b'A'..=b'Z' => b - b'A',
      b'a'..=b'z' => b - b'a' + 26,
      b'0'..=b'9' => b - b'0' + 52,
      b'+' => 62,
      b'/' => 63,
      b'=' | b'\r' | b'\n' | b' ' => continue,
      _ => return Err(format!("Invalid base64 char: {}", b as char)),
    };
    buf = (buf << 6) | (val as u32);
    bits += 6;
    if bits >= 8 {
      bits -= 8;
      out.push((buf >> bits) as u8);
      buf &= (1 << bits) - 1;
    }
  }
  Ok(out)
}

fn get_export_dir() -> std::path::PathBuf {
  #[cfg(target_os = "windows")]
  {
    if let Ok(profile) = std::env::var("USERPROFILE") {
      let pictures = std::path::PathBuf::from(&profile).join("Pictures").join("Grid Leap");
      if std::fs::create_dir_all(&pictures).is_ok() {
        return pictures;
      }
      let downloads = std::path::PathBuf::from(&profile).join("Downloads");
      if downloads.exists() {
        return downloads;
      }
    }
  }
  #[cfg(target_os = "macos")]
  {
    if let Ok(home) = std::env::var("HOME") {
      let pictures = std::path::PathBuf::from(&home).join("Pictures").join("Grid Leap");
      if std::fs::create_dir_all(&pictures).is_ok() {
        return pictures;
      }
      let downloads = std::path::PathBuf::from(&home).join("Downloads");
      if downloads.exists() {
        return downloads;
      }
    }
  }
  #[cfg(target_os = "linux")]
  {
    if let Ok(home) = std::env::var("HOME") {
      let pictures = std::path::PathBuf::from(&home).join("Pictures").join("Grid Leap");
      if std::fs::create_dir_all(&pictures).is_ok() {
        return pictures;
      }
      let downloads = std::path::PathBuf::from(&home).join("Downloads");
      if downloads.exists() {
        return downloads;
      }
    }
  }
  std::env::temp_dir()
}

#[tauri::command]
fn save_image_card(base64_data: String, filename: String, open_file: Option<bool>) -> Result<String, String> {
  let clean_base64 = if let Some(idx) = base64_data.find(',') {
    &base64_data[idx + 1..]
  } else {
    &base64_data
  };

  let bytes = decode_base64(clean_base64)?;
  let export_dir = get_export_dir();
  let safe_filename = if filename.is_empty() {
    format!(
      "Grid_Leap_Victory_{}.png",
      std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
    )
  } else if !filename.ends_with(".png") {
    format!("{}.png", filename)
  } else {
    filename
  };

  let target_path = export_dir.join(&safe_filename);
  std::fs::write(&target_path, bytes).map_err(|e| e.to_string())?;
  let path_str = target_path.to_string_lossy().to_string();

  if open_file.unwrap_or(false) {
    #[cfg(target_os = "windows")]
    {
      use std::process::Command;
      use std::os::windows::process::CommandExt;
      const CREATE_NO_WINDOW: u32 = 0x08000000;
      let _ = Command::new("cmd")
        .args(["/C", "start", "", &path_str])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn();
    }
    #[cfg(target_os = "macos")]
    {
      let _ = std::process::Command::new("open").arg(&path_str).spawn();
    }
    #[cfg(target_os = "linux")]
    {
      let _ = std::process::Command::new("xdg-open").arg(&path_str).spawn();
    }
  }

  Ok(path_str)
}

#[tauri::command]
fn open_url(url: String) -> Result<(), String> {
  #[cfg(target_os = "windows")]
  {
    use std::process::Command;
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x08000000;
    Command::new("rundll32")
      .args(["url.dll,FileProtocolHandler", &url])
      .creation_flags(CREATE_NO_WINDOW)
      .spawn()
      .map_err(|e| e.to_string())?;
  }
  #[cfg(target_os = "macos")]
  {
    std::process::Command::new("open")
      .arg(&url)
      .spawn()
      .map_err(|e| e.to_string())?;
  }
  #[cfg(target_os = "linux")]
  {
    std::process::Command::new("xdg-open")
      .arg(&url)
      .spawn()
      .map_err(|e| e.to_string())?;
  }
  Ok(())
}

#[tauri::command]
fn open_file_path(path: String) -> Result<(), String> {
  #[cfg(target_os = "windows")]
  {
    use std::process::Command;
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x08000000;
    Command::new("rundll32")
      .args(["url.dll,FileProtocolHandler", &path])
      .creation_flags(CREATE_NO_WINDOW)
      .spawn()
      .map_err(|e| e.to_string())?;
  }
  #[cfg(target_os = "macos")]
  {
    std::process::Command::new("open")
      .arg(&path)
      .spawn()
      .map_err(|e| e.to_string())?;
  }
  #[cfg(target_os = "linux")]
  {
    std::process::Command::new("xdg-open")
      .arg(&path)
      .spawn()
      .map_err(|e| e.to_string())?;
  }
  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_url, save_image_card, open_file_path])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
