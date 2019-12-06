const express = require('express');

const Projects = require('../helpers/projectModel');
// const Actions = require('../helpers/');

const router = express.Router();


router.get('/', (req, res) => {
  Projects.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error retrieving the projects' });
    });
});


router.post('/', validateProject, (req, res) => {
  Projects.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error adding the project' });
    });
});


router.put('/:id', validateProject, (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(project => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error updating the project' });
    });
});


router.delete('/:id', (req, res) => {
  Projects.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The project has been deleted' });
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Error removing the project' });
    });
});

router.get('/:id/actions', (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(actions => {
      if (actions[0]) {
        res.status(200).json(actions);
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'Error getting the actions for the project' });
    });
});


router.post('/:id/actions', validateAction, (req, res) => {
  const actionInfo = { ...req.body, project_id: req.params.id };

  Projects.getProjectActions(req.params.id)
    .then(actions => {
      if (actions[0]) {
        Actions.insert(actionInfo)
          .then(action => {
            if (action) {
              res.status(210).json(action);
            } else {
              res
                .status(404)
                .json({ message: 'The project could not be found' });
            }
          })
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({ message: 'Error adding the action for the project' });
          });
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'Error getting the actions for the project' });
    })});



function validateProject(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing project data!' });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'Missing required "name" field!' });
  } else if (!req.body.description) {
    res.status(400).json({ message: 'Missing required "description" field!' });
  } else {
    next();
  }
}


function validateAction(req, res, next) {
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: 'Missing action data!' });
  } else if (!req.body.description) {
    res.status(400).json({ message: 'Missing required "description" field!' });
  } else if (!req.body.notes) {
    res.status(400).json({ message: 'Missing required "notes" field!' });
  } else {
    next();
  }
}


module.exports = router