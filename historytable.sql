USE calc_db;

DROP TABLE IF EXISTS historytable;
CREATE TABLE historytable(
  id                  int NOT NULL,
  modulo        int NOT NULL,
  operand1     DECIMAL (10, 2) NOT NULL,
  operator      VARCHAR(1) NOT NULL,
  operand2     DECIMAL (10, 2) NOT NULL,
  answer         DECIMAL (10, 2) NOT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY (modulo)
);