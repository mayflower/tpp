<?php

namespace Mayflower\TPPBundle\Tests\Controller;

use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ResourceControllerTest extends WebTestCase
{
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

        $this->resource = new Resource();
        $this->resource->setName("ResourceControllerTest resource");

        $this->em->persist($this->resource);
        $this->em->flush();
    }

    public function testDefaultIndex()
    {
        $client = static::createClient();

        $client->request('GET', '/api/resource');
        $response = $client->getResponse();
        $this->assertEquals(
            200,
            $response->getStatusCode(),
            "Unexpected HTTP status code for GET /api/resource"
        );

        $resource_arr = [$this->resource->toArray()];
        $this->assertEquals(json_encode($resource_arr), $response->getContent());
    }

    public function testPost()
    {
        $client = static::createClient();

        $content = '{"name":"Test Resource"}';

        $client->request('POST', '/api/resource', array(), array(), array(), $content);
        $response = $client->getResponse();
        $this->assertEquals(
            200,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/task"
        );
    }

    public function testDelete()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/resource/'.$this->resource->getId());
        $response = $client->getResponse();
        $this->assertEquals(
            204,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/task"
        );
    }

    public function testDeleteWithNonExistentResource()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/resource/'.($this->resource->getId()-1));
        $response = $client->getResponse();
        $this->assertEquals(
            404,
            $response->getStatusCode(),
            "Unexpected HTTP status code for POST /api/task with non-existent resource"
        );
    }

    protected function tearDown()
    {
        parent::tearDown();

        $resources = $this->em->getRepository('MayflowerTPPBundle:Resource')->findAll();
        foreach ($resources as $resource) {
            $this->em->remove($resource);
        }
        $this->em->flush();
    }

}
