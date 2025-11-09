use rusqlite::{params_from_iter, Connection, Result};
use serde::Serialize;
use std::collections::HashMap;

#[derive(Serialize, Debug)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
}

pub const PROJECTS_TABLE: &str = "projects";

pub fn init_db() -> Result<Connection> {
    let conn = Connection::open("app.db")?;
    conn.execute(
        &format!(
            "CREATE TABLE IF NOT EXISTS {} (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                path TEXT NOT NULL
                )",
            PROJECTS_TABLE
        ),
        [],
    )?;
    Ok(conn)
}

pub fn insert(table_name: &str, data: HashMap<&str, String>) -> Result<()> {
    let conn = init_db()?;

    let columns: Vec<&str> = data.keys().cloned().collect();
    let placeholders: Vec<String> = (1..=columns.len()).map(|i| format!("?{}", i)).collect();
    let values: Vec<String> = data.values().cloned().collect();

    let query = format!(
        "INSERT INTO {} ({}) VALUES ({})",
        table_name,
        columns.join(", "),
        placeholders.join(", ")
    );

    conn.execute(&query, params_from_iter(values))?;

    Ok(())
}

pub fn get(
    table_name: &str,
    condition: Option<HashMap<&str, String>>,
) -> Result<Vec<HashMap<String, String>>> {
    let conn = init_db()?;

    let (where_clause, params): (String, Vec<String>) = if let Some(cond) = condition {
        let mut parts = vec![];
        let mut values = vec![];
        for (k, v) in cond.iter() {
            parts.push(format!("{} = ?", k));
            values.push(v.clone());
        }
        (format!("WHERE {}", parts.join(" AND ")), values)
    } else {
        (String::new(), vec![])
    };

    let query = format!("SELECT * FROM {} {}", table_name, where_clause);

    let mut stmt = conn.prepare(&query)?;
    let rows = stmt.query_map(params_from_iter(params), |row| {
        let mut map = HashMap::new();
        for (i, col) in row.as_ref().column_names().iter().enumerate() {
            let val: String = row.get(i)?;
            map.insert(col.to_string(), val);
        }
        Ok(map)
    })?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row?);
    }

    Ok(results)
}

pub fn update(
    table_name: &str,
    data: HashMap<&str, String>,
    condition: HashMap<&str, String>,
) -> Result<()> {
    let conn = init_db()?;

    // Build SET clause
    let mut set_parts = vec![];
    let mut values = vec![];
    for (k, v) in data.iter() {
        set_parts.push(format!("{} = ?", k));
        values.push(v.clone());
    }

    // Build WHERE clause
    let mut where_parts = vec![];
    for (k, v) in condition.iter() {
        where_parts.push(format!("{} = ?", k));
        values.push(v.clone());
    }

    let query = format!(
        "UPDATE {} SET {} WHERE {}",
        table_name,
        set_parts.join(", "),
        where_parts.join(" AND ")
    );

    conn.execute(&query, params_from_iter(values))?;
    Ok(())
}

pub fn delete(table_name: &str, condition: HashMap<&str, String>) -> Result<()> {
    let conn = init_db()?;

    let mut parts = vec![];
    let mut values = vec![];
    for (k, v) in condition.iter() {
        parts.push(format!("{} = ?", k));
        values.push(v.clone());
    }

    let query = format!("DELETE FROM {} WHERE {}", table_name, parts.join(" AND "));

    conn.execute(&query, params_from_iter(values))?;
    Ok(())
}
