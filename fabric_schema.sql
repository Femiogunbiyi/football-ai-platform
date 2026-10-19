-- =========================================================================
-- MICROSOFT FABRIC LAKEHOUSE SCHEMA
-- Target Engine: Synapse Data Warehouse / SQL Analytics Endpoint (Delta Lake)
-- =========================================================================

-- 1. DIMENSION TABLE: High-level match metadata details
CREATE TABLE DimMatches (
    MatchID INT NOT NULL,
    HomeTeam VARCHAR(100) NOT NULL,
    AwayTeam VARCHAR(100) NOT NULL,
    Tournament VARCHAR(100) DEFAULT 'International Tournament',
    MatchDate DATE DEFAULT CAST(GETDATE() AS DATE),
    PRIMARY KEY (MatchID) NOT ENFORCED
);

-- 2. FACT TABLE: Fast-streaming live metrics captured from Azure Event Hubs
CREATE TABLE FactLiveTelemetry (
    TelemetryID VARCHAR(50) NOT NULL,       -- Generated UUID per match update tick
    MatchID INT NOT NULL,
    MatchMinute INT NOT NULL,
    GoalDifferential INT NOT NULL,
    XGDifferential NUMERIC(5,2) NOT NULL,
    RedCardsDifferential INT NOT NULL,
    HomeWinProbability NUMERIC(5,4),        -- Populated downstream by your XGBoost model
    DrawProbability NUMERIC(5,4),        
    AwayWinProbability NUMERIC(5,4),        
    IngestionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
