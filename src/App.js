import React, { useState } from 'react';
import { Search, Copy, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import './App.css';

const App = () => {
  const [businessInput, setBusinessInput] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const responses = {
    notFound: {
      status: 'Business Not Found',
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      color: 'border-red-200 bg-red-50',
      message: `Hello,

I've searched our records and was unable to locate a business matching "${businessInput}". This could be due to several reasons:

**Possible reasons:**
- The business name may be spelled differently in our system
- The business might be registered under a DBA (Doing Business As) name
- The EIN provided might be incorrect or not yet processed

**Next Steps:**
1. Double-check the spelling of the business name
2. Try searching with any known DBA names
3. Verify the EIN is correct and matches the business documents
4. If the business was recently registered, allow 2-3 business days for processing

If you continue to experience issues, please escalate to the verification team for manual review.

Best regards,  
Support Team`
    },
    einMismatch: {
      status: 'EIN Mismatch',
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      color: 'border-yellow-200 bg-yellow-50',
      message: `Hello,

I've located the business "${businessInput}" in our system, however there appears to be a mismatch with the EIN provided. The EIN in our records does not match the documentation submitted.

**Issue:** EIN mismatch detected during verification process

**Next Steps:**
1. Please re-upload the correct IRS documentation (SS-4 or EIN letter)
2. Ensure the EIN matches exactly what's shown on official IRS documents
3. Verify that all digits are entered correctly (format: XX-XXXXXXX)
4. If you believe this is an error, please provide additional supporting documentation

Once the correct EIN documentation is uploaded, the verification process will continue automatically.

Best regards,  
Support Team`
    },
    watchlistHit: {
      status: 'Watchlist Hit',
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      color: 'border-orange-200 bg-orange-50',
      message: `Hello,

Thank you for your submission. The business "${businessInput}" has been flagged in our system and requires additional review before verification can be completed.

**Status:** Manual review required – compliance check in progress

**What this means:**
- Your business information is being reviewed by our compliance team
- This is a standard procedure for certain business types or locations
- No action is required from you at this time

**Next Steps:**
1. Our compliance team will review your business within 2–5 business days
2. You will receive an email notification once the review is complete
3. Additional documentation may be requested if needed

We appreciate your patience during this process. If you have urgent questions, please contact our compliance team directly.

Best regards,  
Support Team`
    },
    verified: {
      status: 'Verified',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      color: 'border-green-200 bg-green-50',
      message: `Hello,

Great news! The business "${businessInput}" has been successfully verified in our system.

**Verification Status:** ✅ Complete

**What's been verified:**
- Business name matches official records
- EIN is valid and matches IRS documentation
- All required documentation has been reviewed
- No compliance issues detected

**Next Steps:**
Your business verification is now complete and you can proceed with your application or account setup. All business information has been approved and is ready for use.

If you need any additional assistance or have questions about your verified business profile, please don't hesitate to reach out.

Best regards,  
Support Team`
    }
  };

  const getRandomResult = () => {
    const outcomes = ['notFound', 'einMismatch', 'watchlistHit', 'verified'];
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    return outcomes[randomIndex];
  };

  const handleCheckStatus = () => {
    if (!businessInput.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      const randomOutcome = getRandomResult();
      setResult(responses[randomOutcome]);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopyResponse = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheckStatus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Identity Troubleshooting Companion
            </h1>
            <p className="text-gray-600">
              Enter a business name or EIN to check verification status and get support guidance
            </p>
          </div>

          <div className="-mt-2 flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={businessInput}
                onChange={(e) => setBusinessInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter business name or EIN..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
              />
            </div>
            <button
              onClick={handleCheckStatus}
              disabled={!businessInput.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Check Status
                </>
              )}
            </button>
          </div>

          {result && (
            <div className={`border-2 rounded-lg p-6 ${result.color}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {result.icon}
                  <h2 className="text-xl font-semibold text-gray-900">
                    {result.status}
                  </h2>
                </div>
                <button
                  onClick={handleCopyResponse}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Response'}
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-sans">
                  {result.message}
                </pre>
              </div>
            </div>
          )}

          {!result && (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Enter a business name or EIN above and click "Check Status" to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
