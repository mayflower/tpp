<?php

namespace Mayflower\TPPBundle\Tests\Controller;

use Doctrine\ORM\EntityManager;
use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class TaskControllerTest extends WebTestCase
{
    private $em;

    protected function setUp()
    {
        parent::setUp();

        static::$kernel = static::createKernel();
        static::$kernel->boot();
        $this->em = static::$kernel->getContainer()
            ->get('doctrine')
            ->getManager();
    }

    public function testDefaultIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/api/task');
        $response = $client->getResponse();
        $this->assertEquals(
            200,
            $response->getStatusCode(),
            "Unexpected HTTP status code for GET /api/task"
        );

        $dt = new \DateTime('this monday');
        $tasks = $this->em->getRepository('MayflowerTPPBundle:Task')->findByWeeks($dt, 5);

        $task_arr = array_map(function(Task $task) {
            return $task->toArray();
        }, $tasks);

        $this->assertEquals(json_encode($task_arr), $response->getContent());
    }

    public function testPost()
    {
        $client = static::createClient();

        $content = '{"project":{"id":2,"name":"TPP","begin":"2013-08-13T22:00:00.000Z","end":"2013-10-10T22:00:00.000Z","color":"#123456"},"resourceId":7,"week":"2013-09-08T22:00:00.000Z"}';

        $client->request('POST', '/api/task', array(), array(), array(), $content);
        $response = $client->getResponse();
        $this->assertEquals(
            200,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/task"
        );

        $id = json_decode($response->getContent(), true)['id'];
        $project = $this->em->find('MayflowerTPPBundle:Task', $id);
        $this->assertEquals(7, $project->getResource()->getId());

        $week = new \DateTime("Mon Sep 09 2013 00:00:00");
        $this->assertEquals($week, $project->getWeek());
    }

    public function testPostWithNonExistentResource()
    {
        $client = static::createClient();

        $content = '{"project":{"id":1,"name":"TPP","begin":"2013-08-13T22:00:00.000Z","end":"2013-10-10T22:00:00.000Z","color":"#123456"},"resourceId":10000,"week":"2013-09-08T22:00:00.000Z"}';

        $client->request('POST', '/api/task', array(), array(), array(), $content);
        $response = $client->getResponse();
        $this->assertEquals(
            404,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/task"
        );
    }

    public function testDelete()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/task/1');
        $response = $client->getResponse();
        $this->assertEquals(
            204,
            $response->getStatusCode(),
            "Unexpected HTTP status code for DELETE /api/task/{id}"
        );

        $task = $this->em->find('MayflowerTPPBundle:Task', 1);
        $this->assertNull($task);

    }

    public function testDeleteWithNonExistentResource()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/task/10000');
        $response = $client->getResponse();
        $this->assertEquals(
            404,
            $response->getStatusCode(),
            "Unexpected HTTP status code for DELETE /api/task/{id}"
        );
    }
}
