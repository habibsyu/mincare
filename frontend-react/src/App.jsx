@@ .. @@
 import React from 'react';
+import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
+import { SocketProvider } from './providers/SocketProvider';
+import ErrorBoundary from './components/common/ErrorBoundary';
+import Navbar from './components/layout/Navbar';
+import Footer from './components/layout/Footer';
+import ProtectedRoute from './components/auth/ProtectedRoute';
+
+// Pages
+import HomePage from './pages/HomePage';
+import LoginPage from './pages/auth/LoginPage';
+import RegisterPage from './pages/auth/RegisterPage';
+import AssessmentPage from './pages/assessment/AssessmentPage';
+import UserDashboard from './pages/dashboard/UserDashboard';
+import ContentListPage from './pages/content/ContentListPage';
+import BlogListPage from './pages/blog/BlogListPage';
+import CommunityLinksPage from './pages/community/CommunityLinksPage';
+import ChatPage from './pages/chat/ChatPage';
+import NotFoundPage from './pages/NotFoundPage';
 
 function App() {
   return (
-    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
-      <p>Start prompting (or editing) to see magic happen :)</p>
-    </div>
+    <ErrorBoundary>
+      <Router>
+        <SocketProvider>
+          <div className="min-h-screen bg-gray-50">
+            <Navbar />
+            <main>
+              <Routes>
+                <Route path="/" element={<HomePage />} />
+                <Route path="/auth/login" element={<LoginPage />} />
+                <Route path="/auth/register" element={<RegisterPage />} />
+                <Route path="/assessment/:type" element={<AssessmentPage />} />
+                <Route path="/contents" element={<ContentListPage />} />
+                <Route path="/blog" element={<BlogListPage />} />
+                <Route path="/community" element={<CommunityLinksPage />} />
+                <Route path="/chat" element={<ChatPage />} />
+                <Route 
+                  path="/dashboard" 
+                  element={
+                    <ProtectedRoute>
+                      <UserDashboard />
+                    </ProtectedRoute>
+                  } 
+                />
+                <Route path="*" element={<NotFoundPage />} />
+              </Routes>
+            </main>
+            <Footer />
+          </div>
+        </SocketProvider>
+      </Router>
+    </ErrorBoundary>
   );
 }
 
 export default App;