// queryDebug.js
import { queryUserByEmail } from './queries.js'; // Adjust the path if necessary
import bcrypt from 'bcrypt';

(async () => {
  try {
    // Email to test
    const emailToTest = 'johnalejandro@sandiego.edu';
    const plainPassword = 'pw123';

    console.log(`Testing query for email: ${emailToTest}`);

    // Query the database for the user
    const result = await queryUserByEmail(emailToTest);
    console.log('Query result:', result);

    if (result.length === 0) {
      console.log('No user found with that email.');
      return;
    }

    // Extract the hashed password from the result
    const storedHashedPassword = result[0].password_hash; // Use password_hash field
    console.log('Stored hashed password:', storedHashedPassword);

    // Verify the provided plain password with the stored hashed password
    const passwordMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
    console.log('Password match:', passwordMatch);

    if (passwordMatch) {
      console.log('Password is correct!');
    } else {
      console.log('Password is incorrect.');
    }
  } catch (error) {
    console.error('Error during query debugging:', error);
  }
})();
