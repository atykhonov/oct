const express = require('express');
const {validationResult} = require('express-validator');

const {objectValidation} = require('./validator');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  let helpMessage = 'POST /objects/aggregate ';
  helpMessage += '{"objects": [{"name": "A", "amount": 1}, {...}]})';
  res.send(helpMessage);
  return res.status(200);
});

app.post('/objects/aggregate', objectValidation(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const nameAmountMap = {};
  req.body.objects.forEach((object) => {
    const amount = parseInt(object['amount']);
    const names = object['name'].split('/');
    names.forEach((name) => {
      let prevAmount = 0;
      if (name in nameAmountMap) {
        prevAmount = nameAmountMap[name];
      }
      nameAmountMap[name] = prevAmount + amount;
    });
  });

  const objects = Object.entries(nameAmountMap).map(([k, v]) => {
    return {
      'name': k,
      'amount': v,
    };
  });

  return res.status(200).json({'objects': objects});
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
