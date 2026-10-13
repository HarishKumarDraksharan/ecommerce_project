
-- Fix demo account password hashes.
-- Passwords: Admin@123 and User@123

UPDATE users
SET password = '$2b$12$.YN/Fjtd6zgRfuJUQ64mauAAZGxDDof7m91mCvXdur2UKoewq03JC'
WHERE email = 'admin@shopsphere.com';

UPDATE users
SET password = '$2b$12$Fs7.uogo7vbGRD2PksVnJursXw9M9EzbnSHlPFBHKi/6RFWgTxJTe'
WHERE email = 'john.doe@example.com';