# Shamir-Secret-Sharing-String
Shamir's Secret Sharing Algorithm

function create(message, K, N)
- This function creates N passwords.
- message could be reconstructed if there are more than K passwords

function combine(shares)
- This function reconstructs message from shares.
- shares is an array consisted of K passwords
