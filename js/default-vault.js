import { uid } from './utils.js';

const f = (label, value, highlight = false) => ({ label, value, highlight });
const card = (name, type, icon, color, fields) => ({ id: uid(), name, type, icon, color, fields });
const sec  = (title, icon, color, cards) => ({ id: uid(), title, icon, color, cards });

export function buildDefaultVault(user) {
  return {
    config: {
      title:            user.name + "'s Vault",
      subtitle:         'Keep this file safe.',
      emergencyMessage: 'This vault belongs to ' + user.name + ' (' + user.mobile + '). If you are reading this, please contact the family financial advisor and lawyer first. Keep strictly private.',
    },
    meta: {
      lastUpdated: new Date().toLocaleDateString('en-IN'),
      createdBy:   user.name,
    },

    sections: [

      sec('Identity Documents', '🪪', 'accent', [
        card('Aadhaar Card', 'UIDAI — Biometric ID', '🪪', 'amber', [
          f('Full Name',   'ENTER YOUR NAME'),
          f('Aadhaar No.', 'XXXX XXXX XXXX', true),
          f('DOB',         'DD/MM/YYYY'),
          f('VID',         'Virtual ID if any'),
          f('Location',    'Where original is kept'),
        ]),
        card('PAN Card', 'Income Tax — Tax ID', '📋', 'green', [
          f('Full Name',     'AS ON PAN CARD'),
          f('PAN Number',    'ABCDE1234F', true),
          f('DOB',           'DD/MM/YYYY'),
          f("Father's Name", 'Enter name'),
          f('Location',      'Where original is kept'),
        ]),
        card('Voter ID Card', 'Election Commission', '🗳️', 'teal', [
          f('Full Name',    'AS ON VOTER ID'),
          f('Voter ID No.', 'ABC1234567', true),
          f('Serial No.',   'Enter serial'),
          f('Constituency', 'Enter constituency'),
          f('Location',     'Where original is kept'),
        ]),
      ]),

      sec('Bank Accounts', '🏦', 'green', [
        card('Bank Name (e.g. SBI)', 'Savings Account', '🏦', 'green', [
          f('Account No.',    'XXXXXXXXXX', true),
          f('IFSC Code',      'XXXXXXX0000'),
          f('Branch',         'Branch name & city'),
          f('Net Banking ID', 'Username / CIF'),
          f('Password',       'Net banking password', true),
          f('Mobile PIN',     'App PIN'),
          f('Linked Mobile',  '+91 XXXXXXXXXX'),
          f('Nominee',        'Nominee name'),
        ]),
        card('Bank Name 2', 'Savings / Current Account', '🏦', 'green', [
          f('Account No.',    'XXXXXXXXXX', true),
          f('IFSC Code',      'XXXXXXX0000'),
          f('Net Banking ID', 'Username'),
          f('Password',       'Password', true),
          f('Linked Mobile',  '+91 XXXXXXXXXX'),
          f('Nominee',        'Nominee name'),
        ]),
      ]),

      sec('ATM / Debit & Credit Cards', '💳', 'amber', [
        card('Bank Name — Debit Card', 'ATM / Debit Card', '💳', 'amber', [
          f('Card Number', 'XXXX XXXX XXXX XXXX', true),
          f('Expiry',      'MM/YY'),
          f('CVV',         'XXX', true),
          f('ATM PIN',     'XXXX', true),
          f('Name on Card','Name as on card'),
        ]),
        card('Bank / Issuer — Credit Card', 'Credit Card', '💳', 'red', [
          f('Card Number',  'XXXX XXXX XXXX XXXX', true),
          f('Expiry',       'MM/YY'),
          f('CVV',          'XXX', true),
          f('PIN',          'XXXX', true),
          f('Credit Limit', '₹ amount'),
          f('Bill Date',    'Billing cycle date'),
          f('Customer Care','Phone number'),
        ]),
      ]),

      sec('Investments — Demat, Zerodha, Mutual Funds', '📈', 'teal', [
        card('Zerodha', 'Stock Broker — Demat Account', '📊', 'teal', [
          f('Client ID',    'ABXXXX (User ID)', true),
          f('Password',     'Kite login password', true),
          f('TOTP Key',     '2FA secret key or app'),
          f('DP ID',        'Depository participant ID'),
          f('Demat Acc No.','16-digit DP account'),
          f('Linked Bank',  'Bank linked for payout'),
          f('Nominee',      'Nominee name'),
        ]),
        card('MF Central', 'Mutual Fund — CAMS / KFintech', '🏛️', 'purple', [
          f('Folio Numbers','Enter all folio nos.', true),
          f('Login Email',  'Registered email'),
          f('Password',     'MF Central password', true),
          f('Linked PAN',   'PAN used for MF'),
          f('Nominee',      'Nominee name'),
          f('AMCs Invested','List of fund houses'),
        ]),
        card('Other Demat / Broker', 'Broker / Depository', '📂', 'teal', [
          f('Client ID',   'User ID', true),
          f('Password',    'Login password', true),
          f('Demat Acc.',  'DP account number'),
          f('Nominee',     'Nominee name'),
        ]),
      ]),

      sec('Insurance Policies', '🛡️', 'red', [
        card('Life Insurance Company', 'Life Insurance Policy', '❤️', 'red', [
          f('Policy No.',    'Policy number', true),
          f('Plan Name',     'Plan / product name'),
          f('Sum Assured',   '₹ coverage amount'),
          f('Premium',       '₹ amount / frequency'),
          f('Premium Due',   'Next due date'),
          f('Maturity Date', 'Policy end date'),
          f('Nominee',       'Nominee name & relation', true),
          f('Agent Name',    'Agent name & phone'),
          f('Login',         'Portal username'),
          f('Password',      'Portal password', true),
          f('Document',      'Where original policy is kept'),
        ]),
        card('Health Insurance Company', 'Health / Mediclaim Policy', '🏥', 'accent', [
          f('Policy No.',      'Policy number', true),
          f('Plan Name',       'Plan name'),
          f('Cover Amount',    '₹ coverage'),
          f('Members',         'Names of all insured'),
          f('Cashless Hosp.',  'Network hospitals nearby'),
          f('TPA Name',        'TPA / admin company'),
          f('Health Card No.', 'Card number if any', true),
          f('Renewal Date',    'Renewal due date'),
          f('Helpline',        '24/7 claim helpline no.'),
          f('Login',           'Portal username'),
          f('Password',        'Portal password', true),
        ]),
        card('Vehicle / Other Insurance', 'Other Insurance Policy', '🚗', 'amber', [
          f('Policy No.',    'Policy number', true),
          f('Type',          'Vehicle / Term / Other'),
          f('Sum Assured',   '₹ coverage'),
          f('Renewal Date',  'Due date'),
          f('Nominee',       'Nominee name'),
        ]),
      ]),

      sec('Email & Digital Accounts', '📧', 'pink', [
        card('Gmail — Primary', 'Google Account', '📧', 'red', [
          f('Email',          'yourname@gmail.com', true),
          f('Password',       'Google account password', true),
          f('Recovery Email', 'Backup email'),
          f('Recovery Phone', '+91 XXXXXXXXXX'),
          f('2FA',            'Authenticator app / SMS'),
          f('Backup Codes',   'Store backup codes here'),
        ]),
        card('Email 2 / Other', 'Email Account', '📧', 'accent', [
          f('Email',   'email@domain.com', true),
          f('Password','Password', true),
          f('Purpose', 'What this account is used for'),
        ]),
        card('GitHub', 'Code Repository', '💻', 'muted', [
          f('Username',       'github-username', true),
          f('Email',          'Linked email'),
          f('Password',       'GitHub password', true),
          f('2FA',            'Authenticator / SMS'),
          f('Important Repos','List key repos if any'),
        ]),
      ]),

      sec('Phone & Device Access', '📱', 'purple', [
        card('Primary Smartphone', 'Mobile Device', '📱', 'purple', [
          f('Mobile No.',      '+91 XXXXXXXXXX', true),
          f('Screen Lock PIN', 'Device unlock PIN', true),
          f('SIM PIN',         'SIM card PIN if set'),
          f('IMEI',            '15-digit IMEI number'),
          f('Network',         'Airtel / Jio / Vi etc.'),
          f('Google/Apple ID', 'Linked account'),
        ]),
        card('Laptop / Computer', 'PC / Laptop', '💻', 'purple', [
          f('Login PIN',      'Windows/Mac login PIN', true),
          f('Password',       'Full password', true),
          f('Important Files','Where key files are stored'),
        ]),
      ]),

    ],

    contacts: [
      { id: uid(), name: 'Financial Advisor / CA',    role: 'For investments & tax matters',           details: ['📞 +91 XXXXXXXXXX', '📧 email@domain.com'] },
      { id: uid(), name: 'Insurance Agent',            role: 'For claim filing & policy',               details: ['📞 +91 XXXXXXXXXX', 'Company name'] },
      { id: uid(), name: 'Lawyer / Advocate',          role: 'For legal & property matters',            details: ['📞 +91 XXXXXXXXXX', '📧 email@domain.com'] },
      { id: uid(), name: 'Trusted Friend / Family',    role: 'Emergency contact who knows the situation', details: ['📞 +91 XXXXXXXXXX', 'Relation: ____________'] },
      { id: uid(), name: 'Primary Bank Manager',       role: 'Main bank relationship manager',          details: ['📞 +91 XXXXXXXXXX', 'Bank: ____________'] },
      { id: uid(), name: 'Zerodha Support',            role: 'For demat account matters',               details: ['📞 080-40402020', '🌐 support.zerodha.com'] },
    ],

    notes: [
      { label: 'Will / Nominations',       value: 'Location of will document',                              highlight: false },
      { label: 'Bank Locker',              value: 'Bank name, locker no., key location',                    highlight: false },
      { label: 'Property / Land',          value: 'Property details, document location',                    highlight: false },
      { label: 'Provident Fund',           value: 'PF / EPFO account number, UAN',                         highlight: true  },
      { label: 'PPF Account',             value: 'PPF account no., bank, maturity date',                   highlight: false },
      { label: 'Fixed Deposits',           value: 'FD details, banks, amounts, maturity',                  highlight: false },
      { label: 'Gold / Jewellery',         value: 'Location and description',                               highlight: false },
      { label: 'Vehicle RC / Insurance',   value: 'Vehicle reg. no., document location',                   highlight: false },
      { label: 'Any Loans',               value: 'Home loan, car loan — bank, EMI details',                highlight: false },
      { label: 'Password Manager',         value: 'If using 1Password/Bitwarden — master password',        highlight: true  },
      { label: 'Other Notes',             value: 'Anything else family must know',                         highlight: false },
    ],
  };
}
