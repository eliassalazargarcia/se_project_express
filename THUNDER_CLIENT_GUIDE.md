# 🧪 Thunder Client - Complete Testing Guide

## 📖 What is Thunder Client?

**Thunder Client** is like a remote control for your API. Instead of building a frontend to test your backend, you can use Thunder Client to:
- Send requests to your server
- Test if signup/login works
- Create, read, update, and delete data
- See responses instantly

Think of it like this: Your backend is a restaurant kitchen, and Thunder Client is how you place orders to see if the kitchen can cook them correctly!

---

## 🚀 Getting Started

### Step 1: Install Thunder Client
1. Open VS Code
2. Click on Extensions icon (or press `Cmd+Shift+X` on Mac / `Ctrl+Shift+X` on Windows)
3. Search for "Thunder Client"
4. Click "Install"

### Step 2: Open Thunder Client
1. Click the Thunder Client icon in the sidebar (⚡ lightning bolt)
2. You'll see:
   - **Collections** - Groups of related requests
   - **Env** - Environment variables (like storing your base URL)
   - **Activity** - History of requests you've made

---

## 🎯 Creating Your First Request

### Setting Up

1. **Create a Collection**:
   - Click "Collections" tab
   - Click "New Collection"
   - Name it: "WTWR API Tests"

2. **Create Environment** (Optional but helpful):
   - Click "Env" tab
   - Click "New Environment"
   - Name it: "Local Development"
   - Add variables:
     ```json
     {
       "baseUrl": "http://localhost:3001",
       "token": ""
     }
     ```
   - Click "Save"

---

## 📝 Test Sequence (Follow in Order!)

### Test 1: Signup (Create New User) ✅

**Why**: Before you can do anything, you need an account!

1. Click "New Request" in your "WTWR API Tests" collection
2. Name it: "1. Signup"
3. Set method to: `POST`
4. URL: `http://localhost:3001/signup`
5. Click "Body" tab
6. Select "JSON" from dropdown
7. Paste this JSON (change the email to your own):

```json
{
  "name": "Test User",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "email": "test@example.com",
  "password": "password123"
}
```

8. Click "Send" button

**Expected Response** (201 Created):
```json
{
  "_id": "65f3a1b2c4d5e6f7g8h9i0j1",
  "name": "Test User",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "email": "test@example.com"
}
```

**✨ Notice**: The password is NOT in the response! This is for security.

---

### Test 2: Login (Get Your JWT Token) 🔑

**Why**: You need a token to access protected routes (like creating items).

1. Create "New Request"
2. Name it: "2. Login"
3. Method: `POST`
4. URL: `http://localhost:3001/signin`
5. Body (JSON):

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

6. Click "Send"

**Expected Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWYzYTFiMmM0ZDVlNmY3ZzhoOWkwajEiLCJpYXQiOjE3MTA1MjM0NTYsImV4cCI6MTcxMTEyODI1Nn0.abcdef123456"
}
```

**⚠️ IMPORTANT**: Copy this token! You'll need it for all protected routes.

**Pro Tip**: Save it to your environment:
- Click "Env" tab
- Edit your environment
- Set `token` to the value you received (the long string)
- Now you can use `{{token}}` in your requests!

---

### Test 3: Get Current User Profile 👤

**Why**: Verify that your token works and see your user info.

1. Create "New Request"
2. Name it: "3. Get My Profile"
3. Method: `GET`
4. URL: `http://localhost:3001/users/me`
5. Click "Auth" tab
6. Select "Bearer Token" from dropdown
7. Paste your token (or use `{{token}}` if you set up environment)
8. Click "Send"

**Expected Response** (200 OK):
```json
{
  "_id": "65f3a1b2c4d5e6f7g8h9i0j1",
  "name": "Test User",
  "avatar": "https://i.pravatar.cc/150?img=1",
  "email": "test@example.com"
}
```

---

### Test 4: Update Your Profile ✏️

**Why**: Test that you can update your name and avatar.

1. Create "New Request"
2. Name it: "4. Update Profile"
3. Method: `PATCH`
4. URL: `http://localhost:3001/users/me`
5. Auth: Bearer Token (your token)
6. Body (JSON):

```json
{
  "name": "Updated Name",
  "avatar": "https://i.pravatar.cc/150?img=5"
}
```

7. Click "Send"

**Expected Response** (200 OK): Updated user object

---

### Test 5: Get All Clothing Items 👕

**Why**: See all items in the database (public route, no token needed).

1. Create "New Request"
2. Name it: "5. Get All Items"
3. Method: `GET`
4. URL: `http://localhost:3001/items`
5. Click "Send" (No auth needed!)

**Expected Response** (200 OK): Array of clothing items

---

### Test 6: Create a Clothing Item ➕

**Why**: Add your own clothing item to the database.

1. Create "New Request"
2. Name it: "6. Create Item"
3. Method: `POST`
4. URL: `http://localhost:3001/items`
5. Auth: Bearer Token (your token)
6. Body (JSON):

```json
{
  "name": "Blue Sweater",
  "weather": "cold",
  "imageUrl": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105"
}
```

7. Click "Send"

**Expected Response** (201 Created):
```json
{
  "_id": "65f3b2c3d4e5f6g7h8i9j0k1",
  "name": "Blue Sweater",
  "weather": "cold",
  "imageUrl": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
  "owner": "65f3a1b2c4d5e6f7g8h9i0j1",
  "likes": [],
  "createdAt": "2024-01-20T00:00:00.000Z"
}
```

**💡 Save the `_id`!** You'll need it for the next tests.

---

### Test 7: Like an Item ❤️

**Why**: Test the social feature - liking items.

1. Create "New Request"
2. Name it: "7. Like Item"
3. Method: `PUT`
4. URL: `http://localhost:3001/items/ITEM_ID_HERE/likes`
   - Replace `ITEM_ID_HERE` with the actual ID from Test 6
5. Auth: Bearer Token (your token)
6. Click "Send" (No body needed)

**Expected Response** (200 OK): Item object with your user ID in the `likes` array

---

### Test 8: Unlike an Item 💔

**Why**: Test removing a like.

1. Create "New Request"
2. Name it: "8. Unlike Item"
3. Method: `DELETE`
4. URL: `http://localhost:3001/items/ITEM_ID_HERE/likes`
5. Auth: Bearer Token (your token)
6. Click "Send"

**Expected Response** (200 OK): Item object with your user ID removed from `likes` array

---

### Test 9: Delete Your Item 🗑️

**Why**: Test ownership protection - you can only delete YOUR items.

1. Create "New Request"
2. Name it: "9. Delete Item (Should Work)"
3. Method: `DELETE`
4. URL: `http://localhost:3001/items/ITEM_ID_HERE`
   - Use the ID from the item YOU created
5. Auth: Bearer Token (your token)
6. Click "Send"

**Expected Response** (200 OK): Deleted item object

---

### Test 10: Try to Delete Someone Else's Item 🚫

**Why**: Verify security - you should NOT be able to delete others' items.

1. Create "New Request"
2. Name it: "10. Delete Item (Should Fail)"
3. Method: `DELETE`
4. URL: `http://localhost:3001/items/SOMEONE_ELSES_ITEM_ID`
5. Auth: Bearer Token (your token)
6. Click "Send"

**Expected Response** (403 Forbidden):
```json
{
  "message": "You don't have permission to delete this item"
}
```

**✅ If you get this error, GOOD!** Your security is working!

---

## 🎨 Thunder Client Tips & Tricks

### 1. **Organize Requests into Folders**
- Right-click your collection
- "New Folder"
- Name it: "Auth", "Items", "Users", etc.
- Drag requests into folders

### 2. **Use Environment Variables**
Instead of typing URLs every time:
```
{{baseUrl}}/signup
{{baseUrl}}/users/me
```

### 3. **Save Responses**
- Click "..." next to response
- "Save to File"
- Useful for debugging

### 4. **Test Collections**
- Click "..." on your collection
- "Run All"
- Tests all requests in order!

### 5. **Headers Tab**
For protected routes, add:
```
Key: Authorization
Value: Bearer {{token}}
```

---

## 🐛 Common Errors and Solutions

### Error: "Network Error" or "Connection Refused"
**Problem**: Server is not running
**Solution**:
```bash
npm run dev
```
Make sure you see: "🚀 Server is running on port 3001"

### Error: "401 Unauthorized"
**Problem**: Missing or invalid token
**Solution**:
1. Login again to get a fresh token
2. Make sure you're using "Bearer Token" auth
3. Check that token is pasted correctly (no extra spaces)

### Error: "403 Forbidden"
**Problem**: You don't have permission (trying to delete someone else's item)
**Solution**: This is correct behavior! Only delete YOUR items.

### Error: "409 Conflict"
**Problem**: Email already exists
**Solution**: Use a different email for signup

### Error: "400 Bad Request"
**Problem**: Invalid data (wrong format, missing required fields)
**Solution**: Check your JSON body matches the examples

---

## 📊 Complete Test Checklist

- [ ] Server is running (`npm run dev`)
- [ ] MongoDB is running
- [ ] Thunder Client extension installed
- [ ] Collection created
- [ ] Test 1: Signup ✅
- [ ] Test 2: Login (save token!) 🔑
- [ ] Test 3: Get profile ✅
- [ ] Test 4: Update profile ✅
- [ ] Test 5: Get all items ✅
- [ ] Test 6: Create item (save ID!) ✅
- [ ] Test 7: Like item ❤️
- [ ] Test 8: Unlike item 💔
- [ ] Test 9: Delete your item ✅
- [ ] Test 10: Try delete others' item (should fail!) 🚫

---

## 🎓 Understanding the Flow

```
1. SIGNUP → Create account → Get user ID
                ↓
2. LOGIN → Send email/password → Receive TOKEN 🔑
                ↓
3. USE TOKEN → Add to "Authorization" header → Access protected routes
                ↓
4. CREATE ITEM → Item is linked to YOUR user ID
                ↓
5. DELETE → Server checks: "Is this YOUR item?"
                ↓
           YES → Item deleted ✅
           NO → Error 403 🚫
```

---

## 🎉 You're Done!

You now know how to:
- ✅ Test authentication (signup/login)
- ✅ Use JWT tokens for protected routes
- ✅ Create and manage items
- ✅ Test security (ownership checks)
- ✅ Debug errors

**Next Step**: Use these same techniques to test your real API when you connect the frontend!

---

**Questions?** Check the main [README.md](README.md) for more details about the API endpoints and error codes.

Happy Testing! 🚀
