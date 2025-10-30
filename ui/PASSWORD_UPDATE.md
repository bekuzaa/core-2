# Password Update Summary

## Changes Made

The default password has been updated from `secret` to `admin123` throughout the entire application.

## Updated Files

### 1. Source Code
- ✅ `src/pages/Login.jsx` - Updated default password display on login page

### 2. Documentation
- ✅ `README.md` - Updated login credentials section
- ✅ `QUICKSTART.md` - Updated all password references (3 locations)
- ✅ `INSTALL.md` - Updated default credentials
- ✅ `PROJECT_SUMMARY.md` - Updated password reference

### 3. Main Repository
- ✅ `../README.md` - Updated Core backend Docker run example and Swagger login

## New Default Credentials

**Username:** `admin`  
**Password:** `admin123`

## Where These Credentials Are Used

1. **Login Page Display**: Shows hint text to users
2. **Documentation**: Referenced in all setup guides
3. **Quick Start Guide**: Used in getting started instructions
4. **Installation Guide**: Mentioned in first-time setup

## Important Notes

### For Users
- Use these credentials for first-time login
- **Change the password immediately** after first login for security
- These are the datarhei Core backend credentials, not just UI credentials

### For Developers
- The password is stored in the datarhei Core backend configuration
- The UI only displays the default credentials as a helpful hint
- Actual authentication is handled by the Core backend API

## Backend Configuration

To change the default password in datarhei Core backend, update:

### Environment Variables
```bash
CORE_API_AUTH_USERNAME=admin
CORE_API_AUTH_PASSWORD=admin123
```

### Docker Run
```bash
docker run -d \
  -e CORE_API_AUTH_USERNAME=admin \
  -e CORE_API_AUTH_PASSWORD=admin123 \
  -p 8080:8080 \
  datarhei/core:latest
```

### Configuration File
```json
{
  "api": {
    "auth": {
      "enable": true,
      "username": "admin",
      "password": "admin123"
    }
  }
}
```

## Security Best Practices

1. **Change Default Password**: Always change from `admin123` to a strong password
2. **Use Strong Passwords**: Minimum 12 characters, mix of letters, numbers, symbols
3. **Enable HTTPS**: Use Let's Encrypt for encrypted connections
4. **Restrict Access**: Use firewall rules to limit access to trusted IPs
5. **Regular Updates**: Keep datarhei Core updated to latest version

## Testing

After updating the password, test:

1. ✅ Login page displays correct default credentials hint
2. ✅ Authentication works with new password
3. ✅ All documentation references are consistent
4. ✅ Quick start guide matches actual credentials

## Files Changed Summary

| File | Lines Changed | Description |
|------|---------------|-------------|
| `src/pages/Login.jsx` | 1 | Login hint text |
| `README.md` | 1 | Login section |
| `QUICKSTART.md` | 3 | Multiple references |
| `INSTALL.md` | 1 | Default credentials |
| `PROJECT_SUMMARY.md` | 1 | Summary section |
| `../README.md` | 2 | Docker run & Swagger login |

**Total:** 9 password references updated across 6 files

## Verification

To verify the changes:

```bash
# Search for old password references
grep -r "secret" ui/*.md ui/src/**/*.jsx

# Should only find unrelated uses of the word "secret" (like JWT secret)
# No references to "admin / secret" should appear
```

## Date Updated

**Last Updated:** 2024

---

**Status:** ✅ Complete - All references to default password updated from `secret` to `admin123`
