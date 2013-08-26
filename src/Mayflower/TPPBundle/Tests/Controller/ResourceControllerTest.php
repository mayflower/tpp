<?php

namespace Mayflower\TPPBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ResourceControllerTest extends WebTestCase
{
    public function testQuery()
    {
        // Create a new client to browse the application
        $client = static::createClient();

        // Get empty entry list from database
        $client->request('GET', '/resource');
        $response = $client->getResponse();
        $this->assertEquals(200, $response->getStatusCode(), "Unexpected HTTP status code for GET /resource/");
//        $this->assertEquals(json_decode($response->getContent()), [], "Unexpected JSON Response");

//        // Add entry to database
//        $client->request('POST', '/resource', [], [], [], json_encode(["name" => "Robin"]));
//        $response = $client->getResponse();
//        $this->assertEquals(200, $response->getStatusCode(), "Unexpected HTTP status code for GET /resource/");
//        static::$kernel = static::createKernel();
//        static::$kernel->boot();
//        $em = static::$kernel->getContainer()
//            ->get('doctrine')
//            ->getManager();
    }

}
