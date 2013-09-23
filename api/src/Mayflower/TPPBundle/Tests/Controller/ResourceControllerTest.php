<?php

namespace Mayflower\TPPBundle\Tests\Controller;

use Mayflower\TPPBundle\Entity\Resource;
use Mayflower\TPPBundle\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ResourceControllerTest extends WebTestCase
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

        $client->request('GET', '/api/resource');
        $response = $client->getResponse();
        $this->assertEquals(
            200,
            $response->getStatusCode(),
            "Unexpected HTTP status code for GET /api/resource"
        );

        $resources = json_decode($response->getContent(), true);
        $this->assertCount(8, $resources);
        $this->assertEquals(['id' => 1, 'name' => 'Johannes'], $resources[0]);
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
            "Unexpected HTTP status code for POST /api/resource"
        );

        $id = json_decode($response->getContent(), true)['id'];
        $project = $this->em->find('MayflowerTPPBundle:Resource', $id);
        $this->assertEquals('Test Resource', $project->getName());
    }

    public function testDelete()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/resource/4');
        $response = $client->getResponse();
        $this->assertEquals(
            204,
            $response->getStatusCode(),
            "Unexpected HTTP status code for DELETE /api/resource"
        );

        $resource = $this->em->find('MayflowerTPPBundle:Resource', 4);
        $this->assertNull($resource);
    }

    public function testDeleteWithNonExistentResource()
    {
        $client = static::createClient();

        $client->request('DELETE', '/api/resource/10000');
        $response = $client->getResponse();
        $this->assertEquals(
            404,
            $response->getStatusCode(),
            "Unexpected HTTP status code for DELETE /api/resource with non-existent resource"
        );
    }

}
