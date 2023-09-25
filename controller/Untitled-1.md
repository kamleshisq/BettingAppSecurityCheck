The error you encountered (`error:1E08010C:DECODER routines::unsupported`) typically occurs when there is an issue with the format or encoding of the private key. It's essential to ensure that the private key is in the correct format and does not contain any extra characters or invalid encoding.

Here are a few suggestions to help troubleshoot the issue:

1. Check the Private Key Format: Make sure the private key is in the PEM format and starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`. Ensure that there are no additional characters or whitespace before or after the key.

2. Remove Line Breaks and Whitespace: Remove any line breaks or extra whitespace within the private key. The key should be a continuous string without any interruptions.

3. Ensure Proper Encoding: Verify that the private key is correctly encoded. It should be in ASCII or UTF-8 encoding.

4. Validate the Private Key: Confirm that the private key is valid and corresponds to the public key used for verification. Double-check the key pair generation process to ensure accuracy.

If the issue persists after checking these points, please provide more information about how you obtained or generated the private key.





-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCeYWOiQ7OJAXFt6L4uMr7t1HXe
DdykIFRHQhH5E1swMPFVXBFziwikEBinXe1HpMMkECZhKPsUys5y65p6aNRUj0Lk
85j7OkhQQgex1oA4M4iUzexqzO/oeGi1YA8HCJD4zbfygk7CIJ8oYqM171WoEI3D
jVtINWjfoAF95NkpVwIDAQAB
-----END PUBLIC KEY-----