<?php

namespace Mayflower\TPPBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use Mayflower\TPPBundle\Entity\Task;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    /**
     * returns Task entities by week
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $now = new \DateTime();

        $week = $request->query->get('week', $now->format('W'));
        $numWeeks = $request->query->get('numWeeks', 5);
        $year = $request->query->get('year', $now->format('Y'));

        $weekDT = new \DateTime($year . 'W' . str_pad($week, 2, '0', STR_PAD_LEFT));

        $tasks = $em->getRepository('MayflowerTPPBundle:Task')->findByWeeks($weekDT, $numWeeks);

        $task_arr = array_map(function (Task $task) {
            return $task->toArray();
        }, $tasks);

        return new JsonResponse($task_arr);
    }

    /**
     * Creates a new Task entity.
     */
    public function createAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $task = new Task();

        $data = json_decode($request->getContent(), true);

        $project = $em->find('MayflowerTPPBundle:Project', $data['project']['id']);
        if (!$project) {
            throw $this->createNotFoundException('Unable to find Project.');
        }
        $task->setProject($project);

        $week = new \DateTime($data['week']);
        $task->setWeek($week);

        $resource = $em->find('MayflowerTPPBundle:Resource', $data['resourceId']);
        if (!$resource) {
            throw $this->createNotFoundException('Unable to find Resource.');
        }

        $task->setResource($resource);

        $em->persist($task);
        $em->flush();

        return new JsonResponse($task->toArray());
    }

    /**
     * Updates a Task entity.
     */
    public function updateAction($id, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        /** @var Task $task */
        $task = $em->find('MayflowerTPPBundle:Task', $id);

        $data = json_decode($request->getContent(), true);

        $project = $em->find('MayflowerTPPBundle:Project', $data['project']['id']);
        if (!$project) {
            throw $this->createNotFoundException('Unable to find Project.');
        }
        $task->setProject($project);

        $em->persist($task);
        $em->flush();

        return new JsonResponse($task->toArray());
    }


    /**
     * Deletes a Task entity.
     */
    public function deleteAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository('MayflowerTPPBundle:Task')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Task entity.');
        }

        $em->remove($entity);
        $em->flush();

        $response = new Response('', 204);
        return $response;
    }
}
