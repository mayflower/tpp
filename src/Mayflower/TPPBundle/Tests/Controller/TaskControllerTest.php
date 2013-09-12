<?php

namespace Mayflower\TPPBundle\Tests\Controller;

use Doctrine\ORM\EntityManager;
use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class TaskControllerTest extends WebTestCase
{
    private $task1;
    private $resource;

    private $em;

    protected function setUp()
    {
        parent::setUp();

        static::$kernel = static::createKernel();
        static::$kernel->boot();
        $this->em = static::$kernel->getContainer()
            ->get('doctrine')
            ->getManager();

        $this->task1 = new Task();
        $this->task1->setTitle('TaskControllerTest task');
        $dt = new \DateTime('next monday');
        $this->task1->setWeek($dt);

        $this->resource = new Resource();
        $this->resource->setName("TaskControllerTest resource");

        $this->em->persist($this->task1);
        $this->em->persist($this->resource);
        $this->em->flush();
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
        $task_arr = [];
        foreach ($tasks as $task) {
            $task_arr[] = $task->toArray();
        }
        $this->assertEquals(json_encode($task_arr), $response->getContent());
    }

    public function testPost()
    {
        $client = static::createClient();

        $content = '{"title":"test","color":"green","resourceId":'.$this->resource->getId().',"week":"Mon Sep 09 2013 01:00:00 GMT+0100 (BST)"}';

        $client->request('POST', '/api/task', array(), array(), array(), $content);
        $response = $client->getResponse();
        $this->assertEquals(
            200,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/task"
        );
    }

    public function testPostWithNonExistentResource()
    {
        $client = static::createClient();

        $content = '{"title":"test","color":"green","resourceId":-1,"week":"Mon Sep 09 2013 01:00:00 GMT+0100 (BST)"}';

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

        $client->request('DELETE', '/api/task/'.$this->task1->getId());
        $response = $client->getResponse();
        $this->assertEquals(
            204,
            $response->getStatusCode(),
            "Unexpected HTTP status code for DELETE /api/task/{id}"
        );
    }

    public function testDeleteWithNonExistentResource()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/task/0');
        $response = $client->getResponse();
        $this->assertEquals(
            404,
            $response->getStatusCode(),
            "Unexpected HTTP status code for DELETE /api/task/{id}"
        );
    }

    protected function tearDown()
    {
        parent::tearDown();

        $tasks = $this->em->getRepository('MayflowerTPPBundle:Task')->findAll();
        foreach ($tasks as $task) {
            $this->em->remove($task);
        }
        $this->em->remove($this->resource);
        $this->em->flush();
    }

}
