'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestAPI() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/db-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
      });

      const data = await res.json();
      setResponse(data);
      setName('');
      setMessage('');
      
      // Refresh the list
      fetchAllData();
    } catch (error) {
      console.error('Error:', error);
      setResponse({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/db-test');
      const data = await res.json();
      setAllData(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">API Connection Test</h1>
        
        {/* Form to add data */}
        <Card>
          <CardHeader>
            <CardTitle>Add Test Data to MongoDB</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save to Database'}
              </Button>
            </form>

            {response && (
              <div className={`mt-4 p-4 rounded ${response.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-semibold">{response.message}</p>
                {response.data && (
                  <pre className="mt-2 text-sm">{JSON.stringify(response.data, null, 2)}</pre>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display all data */}
        <Card>
          <CardHeader>
            <CardTitle>All Data from MongoDB</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchAllData} className="mb-4">
              Refresh Data
            </Button>
            
            {allData.length === 0 ? (
              <p className="text-gray-500">No data yet. Add some above!</p>
            ) : (
              <div className="space-y-2">
                {allData.map((item) => (
                  <div key={item._id} className="border p-3 rounded">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}