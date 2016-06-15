USE calc_db;

DROP TABLE IF EXISTS historytable;
CREATE TABLE historytable(
  id                  int unsigned NOT NULL auto_increment,
  operand1     DECIMAL (10, 2) NOT NULL,
  operator      VARCHAR(1) NOT NULL,
  operand2     DECIMAL (10, 2) NOT NULL ,

  PRIMARY KEY (id)
);