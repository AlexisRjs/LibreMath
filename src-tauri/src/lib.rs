use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};

fn find_modules_dir() -> PathBuf {
    // 1. Check ./modules in current working directory
    let cwd = std::env::current_dir().unwrap_or_else(|_| PathBuf::from("."));
    let p = cwd.join("modules");
    if p.exists() {
        return p;
    }

    // 2. Check next to executable or ancestor
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let p1 = exe_dir.join("modules");
            if p1.exists() {
                return p1;
            }
            // For dev target/debug/
            let p2 = exe_dir.join("../../modules");
            if p2.exists() {
                return p2;
            }
        }
    }

    cwd.join("modules")
}

#[tauri::command]
fn get_modules_path() -> String {
    find_modules_dir().to_string_lossy().to_string()
}

#[tauri::command]
fn save_topic(module_id: String, slug: String, raw_content: String) -> Result<(), String> {
    let modules_dir = find_modules_dir();
    let target_dir = modules_dir.join(&module_id);
    if !target_dir.exists() {
        fs::create_dir_all(&target_dir).map_err(|e| e.to_string())?;
    }
    let target_file = target_dir.join(format!("{}.md", slug));
    fs::write(target_file, raw_content).map_err(|e| e.to_string())?;
    Ok(())
}

fn walk_dir(current_dir: &Path, base_dir: &Path, result: &mut HashMap<String, String>) -> std::io::Result<()> {
    if !current_dir.exists() {
        return Ok(());
    }
    for entry in fs::read_dir(current_dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            walk_dir(&path, base_dir, result)?;
        } else if path.is_file() {
            let ext = path.extension().and_then(|s| s.to_str()).unwrap_or("");
            if ext == "md" || ext == "json" {
                if let Ok(rel) = path.strip_prefix(base_dir) {
                    let rel_str = format!("/modules/{}", rel.to_string_lossy().replace('\\', "/"));
                    if let Ok(content) = fs::read_to_string(&path) {
                        result.insert(rel_str, content);
                    }
                }
            }
        }
    }
    Ok(())
}

#[tauri::command]
fn read_all_files() -> Result<HashMap<String, String>, String> {
    let modules_dir = find_modules_dir();
    let mut result = HashMap::new();
    walk_dir(&modules_dir, &modules_dir, &mut result).map_err(|e| e.to_string())?;
    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            get_modules_path,
            save_topic,
            read_all_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
